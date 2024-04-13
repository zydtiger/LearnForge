import { Button, Modal, Tabs, Table } from 'antd';
import { useEffect, useState } from 'react';
import Markdown from 'react-markdown';
import shortcuts from '../assets/shortcuts.json';

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

function getPlatformSpecific(shortcuts: string[]): string[] {
  const isMacOS = window.navigator.userAgent.indexOf('Mac') != -1;
  return shortcuts.map((shortcut) => {
    return isMacOS ? shortcut.replace('ctrl', 'cmd') : shortcut;
  });
}

function convertShortcutsToTableData() {
  const data = [];
  for (const action in shortcuts) {
    data.push({
      action,
      shortcuts: getPlatformSpecific(shortcuts[action as keyof typeof shortcuts])
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