import { Modal, Radio, Typography, Switch } from "antd";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import {
  getSystemTheme,
  selectGlobalTheme,
  selectMdPreviewTheme,
  setGlobalTheme,
  setIsAutoSave,
  setIsSettingsOpen,
  setMdPreviewTheme,
} from "../redux/slices/settingsSlice";
import { fetchSettings, saveSettings } from "../redux/thunks/settingsThunk";

function Settings() {
  const dispatch = useAppDispatch();
  const isModalOpen = useAppSelector((state) => state.settings.isSettingsOpen);
  const isAutoSave = useAppSelector((state) => state.settings.isAutoSave);
  const globalTheme = useAppSelector(selectGlobalTheme);
  const systemTheme = getSystemTheme();
  const mdPreviewTheme = useAppSelector(selectMdPreviewTheme);

  return (
    <Modal
      centered
      width={800}
      open={isModalOpen}
      onCancel={() => {
        dispatch(setIsSettingsOpen(false));
        dispatch(fetchSettings()); // reset settings to saved
      }}
      onOk={() => {
        dispatch(setIsSettingsOpen(false));
        dispatch(saveSettings());
      }}
    >
      <Typography.Title level={2}>Settings</Typography.Title>

      <Typography.Title level={4}>Global Theme</Typography.Title>
      <Radio.Group
        onChange={(e) => dispatch(setGlobalTheme(e.target.value))}
        value={globalTheme}
      >
        <Radio value="light">Light</Radio>
        <Radio value="dark">Dark</Radio>
        <Radio value="system">
          System ({systemTheme[0].toUpperCase() + systemTheme.substring(1)})
        </Radio>
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

      <Typography.Title level={4} style={{ marginTop: 20 }}>
        Auto Save
        <Switch
          style={{ marginLeft: 20 }}
          checked={isAutoSave}
          onChange={(checked) => dispatch(setIsAutoSave(checked))}
        />
      </Typography.Title>
    </Modal>
  );
}

export default Settings;
