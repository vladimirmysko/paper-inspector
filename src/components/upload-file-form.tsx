'use client';

import { useState, useActionState, type ChangeEvent } from 'react';

import {
  Grid,
  Flex,
  Heading,
  Text,
  TextField,
  Button,
  type GridProps,
} from '@radix-ui/themes';
import { FilePlusIcon } from '@radix-ui/react-icons';
import { Logo } from '@/components/logo';

import { analyzeFileAction } from '@/actions/analyze-file-action';

export function UploadFileForm(props: Omit<GridProps, 'asChild' | 'children'>) {
  const [, formAction, pending] = useActionState(analyzeFileAction, undefined);

  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
  };

  return (
    <Grid columns="1" gap="8" maxWidth="24rem" width="100%" asChild {...props}>
      <form action={formAction}>
        <Logo />

        <Grid columns="1" gap="2">
          <Heading>Загрузка файла</Heading>
          <Text size="2" color="gray">
            Загрузите файл с работой, чтобы произвести проверку
          </Text>
        </Grid>

        <Grid columns="1" gap="5">
          <Grid columns="1" gap="2">
            <Text as="label" htmlFor="fullName" size="2" weight="medium">
              Ф.И.О.
            </Text>
            <TextField.Root
              name="fullName"
              id="fullName"
              placeholder="Иванов Илья Владимирович"
              size="3"
              disabled={pending}
              required
            />
          </Grid>

          <Grid columns="1" gap="2">
            <Text as="label" htmlFor="group" size="2" weight="medium">
              Группа
            </Text>
            <TextField.Root
              name="group"
              id="group"
              placeholder="ИС-22"
              size="3"
              disabled={pending}
              required
            />
          </Grid>
        </Grid>

        <Flex
          direction="column"
          align="center"
          justify="center"
          gap="2"
          p="4"
          style={{
            borderRadius: 'var(--radius-4)',
            border: '1px dashed var(--gray-7)',
          }}
          asChild
        >
          <Text as="label" htmlFor="file" color="gray">
            <FilePlusIcon />
            <Text as="span" size="2">
              Загрузить файл
            </Text>
          </Text>
        </Flex>
        <input
          name="file"
          id="file"
          type="file"
          accept=".doc,.docx,.pdf"
          style={{ display: 'none' }}
          disabled={pending}
          required
          onChange={handleFileChange}
        />
        {file && (
          <Grid columns="1" gap="2">
            <Text size="2" weight="medium">
              Выбран файл
            </Text>
            <Text size="2" color="gray">
              {file.name}
            </Text>
          </Grid>
        )}

        <Button type="submit" size="3" loading={pending} highContrast>
          Проверить
        </Button>
      </form>
    </Grid>
  );
}
