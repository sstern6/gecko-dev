/* -*- indent-tabs-mode: nil; js-indent-level: 2 -*- */
/* vim: set ft=javascript ts=2 et sw=2 tw=80: */
/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

var modifiers = {
  accelKey: true
};

var toolbox;

function test() {
  addTab("about:blank").then(openToolbox);
}

function openToolbox() {
  let target = TargetFactory.forTab(gBrowser.selectedTab);

  gDevTools.showToolbox(target).then((aToolbox) => {
    toolbox = aToolbox;
    toolbox.selectTool("styleeditor").then(testZoom);
  });
}

function testZoom() {
  info("testing zoom keys");

  testZoomLevel("in", 2, 1.2);
  testZoomLevel("out", 3, 0.9);
  testZoomLevel("reset", 1, 1);

  tidyUp();
}

function testZoomLevel(type, times, expected) {
  sendZoomKey("toolbox-zoom-"+ type + "-key", times);

  let zoom = getCurrentZoom(toolbox);
  is(zoom.toFixed(2), expected, "zoom level correct after zoom " + type);

  is(toolbox.zoomValue.toFixed(2), expected,
     "saved zoom level is correct after zoom " + type);
}

function sendZoomKey(id, times) {
  let key = toolbox.doc.getElementById(id).getAttribute("key");
  for (let i = 0; i < times; i++) {
    EventUtils.synthesizeKey(key, modifiers, toolbox.win);
  }
}

function getCurrentZoom() {
  var contViewer = toolbox.frame.docShell.contentViewer;
  return contViewer.fullZoom;
}

function tidyUp() {
  toolbox.destroy().then(function() {
    gBrowser.removeCurrentTab();

    toolbox = modifiers = null;
    finish();
  });
}
