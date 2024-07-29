use chrono::Local;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Debug, Serialize, Deserialize)]
enum GlobalTheme {
    #[serde(rename = "light")]
    Light,
    #[serde(rename = "dark")]
    Dark,
    #[serde(rename = "system")]
    System,
}

#[derive(Debug, Serialize, Deserialize)]
enum PreviewTheme {
    #[serde(rename = "default")]
    Default,
    #[serde(rename = "github")]
    Github,
    #[serde(rename = "vuepress")]
    Vuepress,
    #[serde(rename = "mk-cute")]
    MkCute,
    #[serde(rename = "smart-blue")]
    SmartBlue,
    #[serde(rename = "cyanosis")]
    Cyanosis,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SettingsState {
    #[serde(rename = "isAutoSave")]
    is_auto_save: bool,
    #[serde(rename = "globalTheme")]
    global_theme: GlobalTheme,
    #[serde(rename = "mdPreviewTheme")]
    md_preview_theme: PreviewTheme,
}

impl Default for SettingsState {
    fn default() -> Self {
        Self {
            is_auto_save: true,
            global_theme: GlobalTheme::System,
            md_preview_theme: PreviewTheme::Default,
        }
    }
}

#[derive(Debug, Serialize, Deserialize)]
struct SkillsetRawNode {
    id: Option<String>, // uses Option so None is default value
    name: String,
    #[serde(rename = "progressPercent")]
    progress_percent: f64,
    #[serde(rename = "mdNote")]
    md_note: Option<String>,
    attributes: Option<HashMap<String, serde_json::Value>>,
    children: Option<Vec<SkillsetRawNode>>,
}

impl Default for SkillsetRawNode {
    fn default() -> Self {
        SkillsetRawNode {
            id: None,
            name: "Root".into(),
            progress_percent: 0.0,
            md_note: None,
            attributes: None,
            children: None,
        }
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SkillsetState {
    data: SkillsetRawNode,
    #[serde(rename = "isInitialBoot")]
    is_initial_boot: bool,
    #[serde(rename = "lastSaveTime")]
    last_save_time: String,
}

impl Default for SkillsetState {
    fn default() -> Self {
        SkillsetState {
            data: SkillsetRawNode::default(),
            is_initial_boot: true,
            last_save_time: Local::now().to_rfc3339(), // ISO 8601 format
        }
    }
}
