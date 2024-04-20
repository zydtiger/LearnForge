import { Button, Modal, Tabs, Table } from 'antd';
import { useEffect, useState } from 'react';
import Markdown from 'react-markdown';
import { actions, convertToPlatformShortcuts } from '../lib/menu';

interface ManualModalProps {
  isModalOpen: boolean;
  closeModal: () => void;
}

const tableColumns = [
  {
    title: 'Action',
    dataIndex: 'action',
  },
  {
    title: 'Shortcuts',
    dataIndex: 'shortcuts',
  }
];

function convertShortcutsToTableData() {
  const data = [];
  for (const action in actions) {
    data.push({
      action,
      shortcuts: convertToPlatformShortcuts(actions[action].shortcuts)
        .map((elem) => elem.toUpperCase()).toString(),
    });
  }
  return data;
}

function ManualModal({ isModalOpen, closeModal }: ManualModalProps) {
  const [intro, setIntro] = useState('');
  useEffect(() => {
    fetch('/Manual.md').then((res) => {
      res.text().then(setIntro);
    });
  });

  // define tab items
  const items = [
    {
      key: 'intro',
      label: 'Introduction',
      children: <Markdown>{intro}</Markdown>
    },
    {
      key: 'shortcuts',
      label: 'Shortcuts',
      children: <Table
        size="small"
        pagination={false}
        columns={tableColumns}
        dataSource={convertShortcutsToTableData()}
      />
    }
  ];

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
      <Tabs items={items} />
    </Modal>
  );
}

export default ManualModal;