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
    header: z
      .string()
      .describe(
        'Шапка документа: ФИО студента, группа, тема работы, дата сдачи. Например: «Иванов Илья Владимирович, ИС-22, Свобода в философии Канта, 01.01.2023».'
      ),
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

export async function analyzeFileAction(
  _prevState: unknown,
  formData: FormData
) {
  let reportId = '';

  try {
    const data = uploadFileFormSchema.parse(Object.fromEntries(formData));

    const fileArrayBuffer = await data.file.arrayBuffer();

    const { object } = await generateObject({
      model,
      system:
        `Вы — ассистент веб‑приложения по проверке студенческих работ по дисциплине «Философия». ` +
        `Ваша задача — проанализировать файл с работой студента и выдать отчет о проверке.` +
        `Используйте только русский язык.` +
        `Данные студента: ${data.fullName}, ${data.group}, ${new Date().toLocaleDateString()}.`,
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

    const report = await prisma.report.create({
      data: {
        header: object.report.header,
        finalAssessment: object.report.finalAssessment,
        comment: object.report.comment,
        depthOfUnderstanding: object.report.criterion.depthOfUnderstanding,
        argumentationAndLogic: object.report.criterion.argumentationAndLogic,
        originalityAndCriticism:
          object.report.criterion.originalityAndCriticism,
        styleAndLiteracy: object.report.criterion.styleAndLiteracy,
        formalRequirements: object.report.criterion.formalRequirements,
      },
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
