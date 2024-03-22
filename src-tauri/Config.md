# Configurations

The configuration file provided contains several important settings that govern the behavior and appearance of the application. This document aims to provide a clear explanation of the various configurations and their respective functionalities.

## Build Configuration

### `beforeDevCommand`
- Description: Specifies the command to be executed before starting the development server.
- Value: `"yarn dev"`

### `beforeBuildCommand`
- Description: Specifies the command to be executed before building the application.
- Value: `"yarn build"`

### `devPath`
- Description: Defines the URL path for the development server.
- Value: `"http://localhost:1420"`

### `distDir`
- Description: Specifies the directory where the generated distribution files will be stored.
- Value: `"../dist"`

## Package Configuration

### `productName`
- Description: Sets the name of the packaged application.
- Value: `"learnforge"`

### `version`
- Description: Specifies the version number of the packaged application.
- Value: `"0.0.0"`

## Tauri Configuration

### `allowlist`
- Description: Controls the access permissions for different functionalities.

#### `all`
- Description: Determines whether all functionalities are allowed (`false` by default).

#### `shell`
- Description: Specifies access permissions for shell operations.

##### `all`
- Description: Determines whether all shell operations are allowed (`false` by default).

##### `open`
- Description: Determines whether the "open" shell operation is allowed (`true` by default).

### `windows`
- Description: Defines the settings specific to the Windows platform.

#### `title`
- Description: Sets the window title of the application.
- Value: `"learnforge"`

#### `width`
- Description: Sets the window width of the application.
- Value: `800`

#### `height`
- Description: Sets the window height of the application.
- Value: `600`

#### `fileDropEnabled`
- Description: Determines whether file dropping is enabled.
- Note: You currently have to choose between `tao` file dropping and HTML5 drag & drop.
- Value: `false`

### `security`

#### `csp`
- Description: Specifies the content security policy (CSP) for the application.
- Value: `null`

### `bundle`

#### `active`
- Description: Determines whether the application bundling is enabled (`true` by default).

#### `targets`
- Description: Specifies the target platforms for the bundled application.
- Value: `"all"`

#### `identifier`
- Description: Sets the identifier for the bundled application.
- Value: `"com.tauri.dev"`

#### `icon`
- Description: Specifies the icons to be used for the bundled application.
- Value: An array of icon file paths.

Please refer to this documentation for further details on each configuration and their usage.