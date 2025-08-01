<h1 align="center">
  <br>
  <a href="https://github.com/yama07/ProxyDoggoHandler">
    <img src="resources/icon.png" alt="ProxyDoggoHandler" width="200">
  </a>
  <br>
  Proxy Doggo Handler
  <br>
</h1>

<h4 align="center">Proxy integration and switching tool. For Mac, Windows.</h4>

<p align="center">🐶🐾</p>

<p align="center">
  <a href="https://github.com/yama07/ProxyDoggoHandler"><img src="https://img.shields.io/github/actions/workflow/status/yama07/ProxyDoggoHandler/build.yml" alt="GitHub Workflow Status"></a>
  <a href="https://github.com/yama07/ProxyDoggoHandler/releases"><img src="https://img.shields.io/github/v/release/yama07/ProxyDoggoHandler" alt="GitHub release (latest SemVer)"></a>
  <a href="https://github.com/yama07/ProxyDoggoHandler/blob/master/LICENSE"><img src="https://img.shields.io/github/license/yama07/ProxyDoggoHandler" alt="GitHub"></a>
</p>

## About

プロキシの統合管理・切り替えツールです。
タスクトレイに常駐し、プロキシの中継サーバを立ち上げます。

<p align="center" display="flex">
  <img src="img/screenshot-mac-tray.png" alt="screenshot-mac-tray" width="340">
  <img src="img/screenshot-win-tray.png" alt="screenshot-win-tray" width="340">
</p>

各ツールのプロキシ設定に中継サーバを指定しておくことで、環境に応じたプロキシ設定の書き換えが不要になります。
上流プロキシサーバのプロファイルを複数登録することができ、タスクトレイのメニューから切り替えることができます。

上流プロキシサーバとして、以下のプロトコルをサポートしています。
- HTTP（認証あり／なし）
- HTTPS（認証あり／なし）
- SOCKS v4（認証あり／なし）
- SOCKS v5（認証あり／なし）

また、上流プロキシに対する認証は中継サーバが代行するため、認証プロキシ非対応のアプリケーションを利用できるようになります。

<p align="center">
  <img src="img/about-app.png" alt="about" align="center">
</p>

## Install

### Mac

[Releases ページ](https://github.com/yama07/ProxyDoggoHandler/releases)から`ProxyDoggoHandler-macos.dmg`をダウンロードし、アプリケーションフォルダなどにインストールしてください。

### Windows

[Releases ページ](https://github.com/yama07/ProxyDoggoHandler/releases)から`ProxyDoggoHandler-win-portable.exe`ファイルをダウンロードし、適切なフォルダに格納してください。

コード署名を行なっていないため、exe ファイルを実行した際に SmartScreen の**セキュリティ警告が表示される**ことがあります。
不安に感じる場合は、自身のマシン上でソースコードからビルドすることをお勧めします。

## Uninstall

### Mac

アプリケーションフォルダから Proxy Doggo Handler.app ファイルを削除してください。

また、以下のディレクトリにユーザデータやログが保存されるため、不要な場合は削除してください。

- `~/Library/Application Support/proxy-doggo-handler`
- `~/Library/Logs/proxy-doggo-handler`

### Windows

ProxyDoggoHandler-win-portable.exe ファイルを削除してください。

また、以下のフォルダにユーザデータやログが保存されるため、不要な場合は削除してください。

- `%USERPROFILE%\AppData\Roaming\proxy-doggo-handler`  
  (e.g. `C:\Users\yama07\AppData\Roaming\proxy-doggo-handler`)

## Screenshot

<p align="center" display="flex">
  <img src="img/screenshot-mac-profile.png" alt="screenshot-mac-profile" width="340">
  <img src="img/screenshot-mac-profile-form.png" alt="screenshot-mac-profile-form" width="340">
  <img src="img/screenshot-mac-proxy.png" alt="screenshot-mac-proxy" width="340">
  <img src="img/screenshot-mac-appearance.png" alt="screenshot-mac-appearance" width="340">
</p>

## Development

### Get the code

```
$ git clone https://github.com/yama07/ProxyDoggoHandler
$ cd ProxyDoggoHandler
$ npm install
```

### Run the app

```
$ npm run dev
```

### Build

```sh
$ npm run build

## or
$ npm run build:all
$ npm run build:win:ia32
$ npm run build:win:x64
$ npm run build:mac:x64
$ npm run build:mac:arm64
$ npm run build:mac:universal
```

## Thanks

<div>Icons made by <a href="https://www.flaticon.com/authors/vitaly-gorbachev" title="Vitaly Gorbachev">Vitaly Gorbachev</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
