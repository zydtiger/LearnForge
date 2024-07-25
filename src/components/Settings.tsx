import { Button, Modal, Radio, Typography } from "antd";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import {
  selectGlobalTheme,
  selectMdPreviewTheme,
  setGlobalTheme,
  setIsSettingsOpen,
  setMdPreviewTheme,
} from "../redux/slices/settingsSlice";

function Settings() {
  const dispatch = useAppDispatch();
  const isModalOpen = useAppSelector((state) => state.settings.isSettingsOpen);
  const globalTheme = useAppSelector(selectGlobalTheme);
  const mdPreviewTheme = useAppSelector(selectMdPreviewTheme);

  return (
    <Modal
      centered
      width={800}
      open={isModalOpen}
      onCancel={() => dispatch(setIsSettingsOpen(false))}
      footer={
        <Button
          type="primary"
          onClick={() => dispatch(setIsSettingsOpen(false))}
        >
          Quit
        </Button>
      }
    >
      <Typography.Title level={2}>Settings</Typography.Title>

      <Typography.Title level={4}>Global Theme</Typography.Title>
      <Radio.Group
        onChange={(e) => dispatch(setGlobalTheme(e.target.value))}
        value={globalTheme}
      >
        <Radio value="light">Light</Radio>
        <Radio value="dark">Dark</Radio>
        <Radio value="system">System</Radio>
      </Radio.Group>

      <Typography.Title level={4} style={{ marginTop: 20 }}>
        Note Editor Preview Theme
      </Typography.Title>
      <Radio.Group
        onChange={(e) => dispatch(setMdPreviewTheme(e.target.value))}
        value={mdPreviewTheme}
      >
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
