---
layout: post
title: "Restore GNOME Panel in Ubuntu"
date: 2010-06-17 11:36:44 -0600
comments: true
categories:
---

It's fairly easy (if you need terminal access, press `ALT-F3` and enter `gnome-terminal`).

You can then copy and paste the following into the terminal (without the numbers):

```bash
$ gconftool-2 --shutdown
$ gconftool-2 --recursive-unset /apps/panel
$ rm -rf ~/.gconf/apps/panel
$ pkill gnome-panel
```

You should have now reset your GNOME panel configuration (both top and bottom panels).
