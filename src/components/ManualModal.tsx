import { Button, Modal, Tabs, Table } from "antd";
import Markdown from "react-markdown";
import { actions, convertToPlatformShortcuts } from "../lib/menu";

interface ManualModalProps {
  isModalOpen: boolean;
  closeModal: () => void;
}

const tableColumns = [
  {
    title: "Action",
    dataIndex: "action",
  },
  {
    title: "Shortcuts",
    dataIndex: "shortcuts",
  },
];

function convertShortcutsToTableData() {
  const data = [];
  for (const action in actions) {
    data.push({
      key: action,
      action,
      shortcuts: convertToPlatformShortcuts(actions[action].shortcuts)
        .map((elem) => elem.toUpperCase())
        .toString(),
    });
  }
  return data;
}

function ManualModal({ isModalOpen, closeModal }: ManualModalProps) {
  const intro = `
## LearnForge - Learning Goal Management and Logging App

LearnForge is a comprehensive app that empowers you to manage and track your learning goals with ease. This helper provides an overview of LearnForge and its features.

### Features

- **Skill Tree Visualizer**: LearnForge features a captivating "skill tree" interface, reminiscent of tech trees in games like Stellaris. This visual representation allows you to organize and track your acquired skills under different categories, such as software, hardware, machine learning, and more.

- **Goal Management**: With LearnForge, you can define your goals for skill acquisition. The app enables you to track progress and mark completed goals, facilitating efficient goal management.

- **Logging Progress**: Keep a record of your learning journey by logging your progress. LearnForge allows you to add notes, milestones, and achievements in markdown format, providing a comprehensive overview of your process.

- **Category-based Organization**: Categorize your skills based on different domains, such as programming languages, frameworks, or specific areas of expertise. This categorization simplifies navigation and enables you to focus on specific skill sets.

- **Cross-Platform Compatibility**: LearnForge is built using Electron, Tauri, React, and TypeScript. This technology stack ensures cross-platform compatibility, allowing you to run the app locally on various operating systems.
  `;

  const about = `
## About LearnForge (FOSS)

Version: 0.1.0

License: MIT

Github: https://github.com/zydtiger/LearnForge
  `;

  // define tab items
  const items = [
    {
      key: "intro",
      label: "Introduction",
      children: <Markdown>{intro}</Markdown>,
    },
    {
      key: "shortcuts",
      label: "Shortcuts",
      children: (
        <Table
          size="small"
          pagination={false}
          columns={tableColumns}
          dataSource={convertShortcutsToTableData()}
        />
      ),
    },
    {
      key: "about",
      label: "About",
      children: <Markdown>{about}</Markdown>,
    },
  ];

  return (
    <Modal
      centered
      width={800}
      open={isModalOpen}
      onCancel={closeModal}
      footer={() => (
        <Button type="primary" onClick={closeModal}>
          OK
        </Button>
      )}
    >
      <Tabs items={items} />
    </Modal>
  );
}

export default ManualModal;
