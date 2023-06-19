import { Capacitor } from "@capacitor/core";
import { Clipboard } from "@capacitor/clipboard";


function calc(num) {
  return num.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0]
}

export function numberWithCommas(n) {
  n = calc(n ? n : 0)
  var parts = n?.toString().split(".");
  return (
    parts[0]?.replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
    (parts[1] ? "." + parts[1] : "")
  );
}
export const syncWait = ms => {
  //const end = Date.now() + ms
  //while (Date.now() < end) continue
}


export function copy(text) {
  if (Capacitor.isNativePlatform()) {
    // do something
    return new Promise((resolve, reject) => {
      Clipboard.write({
        string: text
      }).then(resolve, reject).catch(reject);
    });
  } else {
    return new Promise((resolve, reject) => {
      if (typeof navigator !== "undefined" && typeof navigator.clipboard !== "undefined" && navigator.permissions !== "undefined") {
        const type = "text/plain";
        const blob = new Blob([text], { type });
        const data = [new ClipboardItem({ [type]: blob })];
        navigator.permissions.query({ name: "clipboard-write" }).then((permission) => {
          if (permission.state === "granted" || permission.state === "prompt") {
            navigator.clipboard.write(data).then(resolve, reject).catch(reject);
          }
          else {
            reject(new Error("Permission not granted!"));
          }
        });
      }
      else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
        var textarea = document.createElement("textarea");
        textarea.textContent = text;
        textarea.style.position = "fixed";
        textarea.style.width = '2em';
        textarea.style.height = '2em';
        textarea.style.padding = 0;
        textarea.style.border = 'none';
        textarea.style.outline = 'none';
        textarea.style.boxShadow = 'none';
        textarea.style.background = 'transparent';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        try {
          document.execCommand("copy");
          document.body.removeChild(textarea);
          resolve();
        }
        catch (e) {
          document.body.removeChild(textarea);
          reject(e);
        }
      }
      else {
        reject(new Error("None of copying methods are supported by this browser!"));
      }
    });
  }
}