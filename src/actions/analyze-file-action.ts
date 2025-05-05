'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { prisma } from '@/lib/prisma';

const model = openai('o4-mini');

const uploadFileFormSchema = z.object({
  fullName: z.string().min(1, { message: 'Поле обязательно для заполнения' }),
  group: z.string().min(1, { message: 'Поле обязательно для заполнения' }),
  file: z.instanceof(File).refine((file) => file.size <= 10 * 1024 * 1024, {
    message: 'Файл должен быть меньше 10 МБ',
  }),
});

const analyzeFileSchema = z.object({
  report: z.object({
    finalAssessment: z
      .string()
      .describe('Итоговая оценка: балл и/или буквенный эквивалент (A–F).'),
    comment: z.string().describe('комментарий к работе'),
    criterion: z
      .object({
        depthOfUnderstanding: z
          .number()
          .describe('Глубина понимания философской проблемы (0–20 баллов).'),
        argumentationAndLogic: z
          .number()
          .describe('Аргументация и логическая стройность изложения (0–20).'),
        originalityAndCriticism: z
          .number()
          .describe('Оригинальность суждений и критический анализ (0–15).'),
        styleAndLiteracy: z.number().describe('Стиль и грамотность (0–10).'),
        formalRequirements: z
          .number()
          .describe(
            'Формальные требования (объём, структура, оформление) (0–10).'
          ),
      })
      .describe('Рубрика оценивания (по ключевым критериям).'),
  }),
});

async function analyzeFile(
  data: {
    id: string;
    fullName: string;
    group: string;
    file: File;
  },
  fileArrayBuffer: ArrayBuffer
) {
  const report = await prisma.report.findUnique({
    where: { id: data.id },
  });

  if (!report) {
    console.error('Report not found in the database');
    throw new Error('Report not found');
  }

  const { object } = await generateObject({
    model,
    system:
      `Вы — ассистент веб‑приложения по проверке студенческих работ по дисциплине «Философия». ` +
      `Ваша задача — проанализировать файл с работой студента и выдать отчет о проверке.` +
      `Используйте только русский язык.`,
    schema: analyzeFileSchema,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'file',
            data: fileArrayBuffer,
            mimeType: data.file.type,
          },
        ],
      },
    ],
  });

  await prisma.report.update({
    where: { id: report.id },
    data: {
      finalAssessment: object.report.finalAssessment,
      comment: object.report.comment,
      depthOfUnderstanding: object.report.criterion.depthOfUnderstanding,
      argumentationAndLogic: object.report.criterion.argumentationAndLogic,
      originalityAndCriticism: object.report.criterion.originalityAndCriticism,
      styleAndLiteracy: object.report.criterion.styleAndLiteracy,
      formalRequirements: object.report.criterion.formalRequirements,
    },
  });
}

export async function analyzeFileAction(
  _prevState: unknown,
  formData: FormData
) {
  let reportId = '';

  try {
    const data = uploadFileFormSchema.parse(Object.fromEntries(formData));

    const fileArrayBuffer = await data.file.arrayBuffer();

    const report = await prisma.$transaction(async (tx) => {
      return tx.report.create({
        data: {
          header: `${data.fullName}, ${data.group}, ${new Date().toLocaleDateString('ru-RU', { dateStyle: 'long' })}`,
        },
      });
    });

    analyzeFile({ ...data, id: report.id }, fileArrayBuffer).catch((error) => {
      console.error('Error analyzing file:', error);
    });

    reportId = report.id;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: Object.fromEntries(
          Object.entries(error.flatten().fieldErrors).map(([key, value]) => [
            key,
            value?.join(', '),
          ])
        ),
      };
    }

    return {
      success: false,
      errors: {
        server: 'Произошла ошибка на сервере. Попробуйте позже.',
      },
    };
  }

  redirect(`/${reportId}`);
}
