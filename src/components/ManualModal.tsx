import { Button, Modal } from 'antd';
import Markdown from 'react-markdown';

const res = await fetch('/Manual.md');
const intro = await res.text();

interface ManualModalProps {
  isModalOpen: boolean;
  closeModal: () => void;
}

function ManualModal({ isModalOpen, closeModal }: ManualModalProps) {
  return (
    <Modal
      centered
      width={800}
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

export default ManualModal;