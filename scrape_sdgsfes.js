import { fetchOrLoad } from "https://js.sabae.cc/fetchOrLoad.js";
import { HTMLParser } from "https://js.sabae.cc/HTMLParser.js";
import { CSV } from "https://code4fukui.github.io/CSV/CSV.js";
//import { sleep } from "https://js.sabae.cc/sleep.js";

const url = "https://fes.sabae-sdgs.jp/";
//const baseurl = url;

const html = await fetchOrLoad(url);
const dom = HTMLParser.parse(html);

const divs = dom.querySelectorAll(".exhibit-container2");

/*
<div class="exhibit-title">花咲く越前和紙</div>
              特定非営利活動法人ハートオブマインド<br>
              SDGs目標：<span class="sdgs-icon type3" data-toggle="modal" data-target="#sdgsModal" data-type="3">3</span> <span class="sdgs-icon type15" data-toggle="modal" data-target="#sdgsModal" data-type="15">15</span>
              <br><br><img src="img/heartofmind.jpg" width="100%" alt="">
            </
            */

const fn = "sdgsfes.csv";
const list = await CSV.fetchJSON(fn, []);
//const list = []; // for init
for (const div of divs) {
  const title = div.querySelector(".exhibit-title").text.trim();
  if (list.find(i => i.item == title)) continue;

  //const body = div.querySelector(".mt-20").text;
  const alltext = div.text.trim();
  const remain = alltext.substring(title.length).trim();
  const nr = remain.indexOf("SDGs目標：");
  const team = nr == 0 ? title : remain.substring(0, remain.indexOf("\n"));
  const nr2 = remain.indexOf("\n", nr);
  const sdgs = remain.substring(nr + "SDGs目標：".length, nr2 < 0 ? remain.length : nr2).replace(/\s/g, ",");
  list.push({ name: team, item: title, sdgs, category: "", type: "" });
  //break;
}

await Deno.writeTextFile(fn, CSV.stringify(list));

