import { Button, Modal, Radio, Typography } from "antd";

function Settings() {
  return (
    <Modal centered width={800} open={true} footer={<Button>Quit</Button>}>
      <Typography.Title level={2}>Settings</Typography.Title>

      <Typography.Title level={4}>Global Theme</Typography.Title>
      <Radio.Group onChange={(e) => console.log(e.target.value)}>
        <Radio value="light">Light</Radio>
        <Radio value="dark">Dark</Radio>
        <Radio value="system">System</Radio>
      </Radio.Group>

      <Typography.Title level={4} style={{ marginTop: 20 }}>
        Note Editor Preview Theme
      </Typography.Title>
      <Radio.Group onChange={(e) => console.log(e.target.value)}>
        <Radio value="default">Default</Radio>
        <Radio value="github">Github</Radio>
        <Radio value="vuepress">Vuepress</Radio>
        <Radio value="mk-cute">Mk Cute</Radio>
        <Radio value="smart-blue">Smart Blue</Radio>
        <Radio value="cyanosis">Cyanosis</Radio>
      </Radio.Group>
    </Modal>
  );
}

export default Settings;
