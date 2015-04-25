# Completion for update

> Borrowed from gulp, thanks to gulp and the grunt team and Tyler Kellen for creating this.

To enable tasks auto-completion in shell you should add `eval "$(update --completion=shell)"` in your `.shellrc` file.

## Bash

Add `eval "$(update --completion=bash)"` to `~/.bashrc`.

## Zsh

Add `eval "$(update --completion=zsh)"` to `~/.zshrc`.

## Powershell

Add `Invoke-Expression ((update --completion=powershell) -join [System.Environment]::NewLine)` to `$PROFILE`.

## Fish

Add `update --completion=fish | source` to `~/.config/fish/config.fish`.
