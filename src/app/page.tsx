import { Flex } from '@radix-ui/themes';
import { UploadFileForm } from '@/components/upload-file-form';

export default function HomePage() {
  return (
    <Flex direction="column" align="center" justify="center" minHeight="100svh">
      <UploadFileForm />
    </Flex>
  );
}
