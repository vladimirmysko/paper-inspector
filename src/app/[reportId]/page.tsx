import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';

import { Button, Flex, Grid, Heading, Table, Text } from '@radix-ui/themes';
import { Logo } from '@/components/logo';

import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ reportId: string }>;
}): Promise<Metadata> {
  const { reportId } = await params;

  return {
    title: `Paper Inspector - Индивидуальный отчёт ${reportId}`,
    description: `Индивидуальный отчёт ${reportId}`,
  };
}

export default async function ReportPage({
  params,
}: {
  params: Promise<{ reportId: string }>;
}) {
  const { reportId } = await params;

  const report = await prisma.report.findUnique({
    where: {
      id: reportId,
    },
  });

  if (!report) {
    notFound();
  }

  return (
    <Flex direction="column" align="center" minHeight="100svh" px="4" py="8">
      <Grid columns="1" gap="8" maxWidth="48rem" width="100%">
        <Logo />

        <Heading>Индивидуальный отчёт</Heading>

        {report.finalAssessment ? (
          <>
            <Table.Root>
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell pl="0" pr="5">
                    <Text weight="bold">Раздел</Text>
                  </Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell pl="0" pr="5">
                    <Text weight="bold">Содержание</Text>
                  </Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                <Table.Row>
                  <Table.RowHeaderCell pl="0" pr="5">
                    <Text weight="bold">Шапка</Text>
                  </Table.RowHeaderCell>
                  <Table.Cell pl="0" pr="5">
                    {report.header}
                  </Table.Cell>
                </Table.Row>

                <Table.Row>
                  <Table.RowHeaderCell pl="0" pr="5">
                    <Text weight="bold">Итоговая оценка</Text>
                  </Table.RowHeaderCell>
                  <Table.Cell pl="0" pr="5">
                    {(() => {
                      const totalPoints = Object.values(report).reduce<number>(
                        (sum, value) =>
                          typeof value === 'number' ? sum + value : sum,
                        0
                      );

                      return `${totalPoints} / 100 (${report.finalAssessment})`;
                    })()}
                  </Table.Cell>
                </Table.Row>

                <Table.Row>
                  <Table.RowHeaderCell pl="0" pr="5">
                    <Text weight="bold">Комментарии</Text>
                  </Table.RowHeaderCell>
                  <Table.Cell pl="0" pr="5">
                    {report.comment}
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table.Root>

            <Heading as="h2" size="4">
              Таблица рубрики
            </Heading>

            <Table.Root>
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell pl="0" pr="5">
                    <Text weight="bold">Критерий</Text>
                  </Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell align="right" pr="0">
                    <Text weight="bold">Макс. балл</Text>
                  </Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell align="right" pr="0">
                    <Text weight="bold">Получено</Text>
                  </Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                <Table.Row>
                  <Table.RowHeaderCell pl="0" pr="5">
                    Глубина понимания
                  </Table.RowHeaderCell>
                  <Table.Cell align="right" pr="0">
                    20
                  </Table.Cell>
                  <Table.Cell align="right" pr="0">
                    {report.depthOfUnderstanding}
                  </Table.Cell>
                </Table.Row>

                <Table.Row>
                  <Table.RowHeaderCell pl="0" pr="5">
                    Аргументация и логика
                  </Table.RowHeaderCell>
                  <Table.Cell align="right" pr="0">
                    20
                  </Table.Cell>
                  <Table.Cell align="right" pr="0">
                    {report.argumentationAndLogic}
                  </Table.Cell>
                </Table.Row>

                <Table.Row>
                  <Table.RowHeaderCell pl="0" pr="5">
                    Оригинальность и критика
                  </Table.RowHeaderCell>
                  <Table.Cell align="right" pr="0">
                    15
                  </Table.Cell>
                  <Table.Cell align="right" pr="0">
                    {report.originalityAndCriticism}
                  </Table.Cell>
                </Table.Row>

                <Table.Row>
                  <Table.RowHeaderCell pl="0" pr="5">
                    Стиль и грамотность
                  </Table.RowHeaderCell>
                  <Table.Cell align="right" pr="0">
                    10
                  </Table.Cell>
                  <Table.Cell align="right" pr="0">
                    {report.styleAndLiteracy}
                  </Table.Cell>
                </Table.Row>

                <Table.Row>
                  <Table.RowHeaderCell pl="0" pr="5">
                    Формальные требования
                  </Table.RowHeaderCell>
                  <Table.Cell align="right" pr="0">
                    10
                  </Table.Cell>
                  <Table.Cell align="right" pr="0">
                    {report.formalRequirements}
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table.Root>
          </>
        ) : (
          <>
            <Text size="3" color="gray">
              Отчёт ещё не готов. Пожалуйста, подождите.
            </Text>
          </>
        )}
      </Grid>
    </Flex>
  );
}
