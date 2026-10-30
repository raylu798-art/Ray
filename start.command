#!/bin/bash
set -euo pipefail

if [[ "${1:-}" == "--help" || "${1:-}" == "-h" ]]; then
  printf '%s\n' '用法：bash start.command [--check]' '默认：校验配置并在前台启动网站。' '--check：仅校验 Caddy 配置。' '默认访问地址：http://127.0.0.1:8080'
  exit 0
fi

if [[ $# -gt 1 || ( $# -eq 1 && "$1" != "--check" ) ]]; then
  printf '%s\n' '参数不正确，请运行：bash start.command --help' >&2
  exit 2
fi

DEPLOY_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
cd "$DEPLOY_DIR"

if [[ ! -f "$DEPLOY_DIR/dist/index.html" ]]; then
  printf '%s\n' '未找到 dist/index.html。请保持启动脚本与 dist 文件夹位于同一个目录。' >&2
  exit 1
fi

CADDY_BIN="$(command -v caddy || true)"
if [[ -z "$CADDY_BIN" && -x /opt/homebrew/bin/caddy ]]; then
  CADDY_BIN=/opt/homebrew/bin/caddy
fi
if [[ -z "$CADDY_BIN" && -x /usr/local/bin/caddy ]]; then
  CADDY_BIN=/usr/local/bin/caddy
fi
if [[ -z "$CADDY_BIN" ]]; then
  printf '%s\n' '需要先安装 Caddy 2。已安装 Homebrew 的 Mac 可运行：' '  brew install caddy' '安装完成后，再运行：bash start.command' '安装说明：https://caddyserver.com/docs/install#homebrew-mac' >&2
  exit 1
fi

"$CADDY_BIN" validate --config "$DEPLOY_DIR/Caddyfile" --adapter caddyfile
if [[ "${1:-}" == "--check" ]]; then
  exit 0
fi

printf '%s\n' '正在启动个人网站。' '默认地址：http://127.0.0.1:8080' '局域网访问：http://这台Mac的局域网IP:8080' '按 Control+C 停止；实际监听地址以 Caddyfile 为准。'
exec "$CADDY_BIN" run --config "$DEPLOY_DIR/Caddyfile" --adapter caddyfile
