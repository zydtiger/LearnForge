import { Button, Modal } from 'antd';
import { useEffect, useState } from 'react';
import Markdown from 'react-markdown';

interface ManualModalProps {
  isModalOpen: boolean;
  closeModal: () => void;
}

function ManualModal({ isModalOpen, closeModal }: ManualModalProps) {
  const [intro, setIntro] = useState('');
  useEffect(() => {
    fetch('/Manual.md').then((res) => {
      res.text().then(setIntro);
    });
  });

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