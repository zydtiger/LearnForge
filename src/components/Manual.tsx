import { useState } from 'react';
import { Button, Modal } from 'antd';
import Markdown from 'react-markdown';

const res = await fetch('/public/Manual.md');
const intro = await res.text();

function Manual() {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const closeModal = () => setIsModalOpen(false);

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