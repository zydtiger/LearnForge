import { Button, Modal } from 'antd';
import Markdown from 'react-markdown';

const res = await fetch('/public/Manual.md');
const intro = await res.text();

interface ManualProps {
  isModalOpen: boolean;
  closeModal: () => void;
}

function Manual({ isModalOpen, closeModal }: ManualProps) {
  return (
    <Modal
      open={isModalOpen}
      onCancel={closeModal}
      footer={() => (
        <Button type='primary' onClick={closeModal}>OK</Button>
      )}
    >
      <Markdown>{intro}</Markdown>
    </Modal>
  );
}

export default Manual;