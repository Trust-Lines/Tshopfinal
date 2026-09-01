// Scoped port of the stage-configurator design. Every rule lives under
// `.tscfg` so it never leaks into the rest of the site.
export const CFG_CSS = `
.tscfg{
  --paper:#F2F1EF;--card:#fff;--ink:#17181A;--ink2:#5E6166;--ink3:#93969B;
  --red:#B5352E;--red-t:#FDF2F1;--oak:#C0813E;--line:#E5E3E0;--line2:#D6D3CF;--ok:#2F7D5B;
  --fd:var(--f-sora),system-ui,sans-serif;
  --fb:var(--f-inter),system-ui,sans-serif;
  --fm:var(--f-mono),monospace;
  background:var(--paper);color:var(--ink);font-family:var(--fb);font-size:14px;line-height:1.6;
  -webkit-font-smoothing:antialiased;
}
.tscfg *{box-sizing:border-box}
.tscfg h2{font-family:var(--fd);font-weight:600;margin:0;letter-spacing:-.015em}
.tscfg button{font-family:var(--fb);cursor:pointer}
.tscfg :focus-visible{outline:2px solid var(--red);outline-offset:2px}

.tscfg .top{background:var(--card);border-bottom:1px solid var(--line);padding:10px 18px;display:flex;align-items:center;gap:12px}
.tscfg .brand b{display:block;font-family:var(--fd);font-weight:600;font-size:14px;line-height:1.1}
.tscfg .brand span{font-size:10.5px;color:var(--ink3)}
.tscfg .steps{margin-left:auto;display:flex;gap:5px;flex-wrap:wrap}
.tscfg .pill{display:flex;align-items:center;gap:6px;font-size:11.5px;color:var(--ink3);padding:3px 9px;border-radius:999px}
.tscfg .pill i{width:16px;height:16px;border-radius:50%;background:var(--line);color:var(--ink3);display:grid;place-items:center;font-size:9.5px;font-style:normal;font-family:var(--fm)}
.tscfg .pill.on{background:var(--red-t);color:var(--red)}
.tscfg .pill.on i{background:var(--red);color:#fff}
.tscfg .pill.done i{background:var(--ok);color:#fff}

.tscfg .shell{display:grid;grid-template-columns:1fr 340px;gap:16px;padding:18px;align-items:start;max-width:1480px;margin:0 auto}
.tscfg .stage{display:flex;flex-direction:column;gap:12px}

.tscfg .canvas{position:relative;background:var(--card);border:1px solid var(--line);border-radius:10px;overflow:hidden}
.tscfg .scene{display:block;width:100%;height:min(74vh,760px);min-height:520px;background:linear-gradient(#FCFBFA,#EFEEEB)}
.tscfg .float{position:absolute;display:flex;gap:6px;z-index:2}
.tscfg .float.tl{top:11px;left:11px}
.tscfg .float.tr{top:11px;right:11px}
.tscfg .tool{font-size:11.5px;border:1px solid var(--line);background:rgba(255,255,255,.92);border-radius:6px;padding:5px 11px;color:var(--ink2);backdrop-filter:blur(4px)}
.tscfg .tool:hover{border-color:var(--line2);color:var(--ink)}
.tscfg .tool.on{border-color:var(--red);color:var(--red);background:var(--red-t)}
.tscfg .caption{position:absolute;bottom:11px;left:11px;font-size:11px;color:var(--ink3);background:rgba(255,255,255,.9);border:1px solid var(--line);border-radius:6px;padding:4px 10px;z-index:2}
.tscfg .empty{width:100%;height:min(74vh,760px);min-height:520px;display:grid;place-items:center;background:linear-gradient(#FCFBFA,#EFEEEB)}
.tscfg .empty div{border:1px dashed var(--line2);border-radius:6px;padding:44px 60px;color:#A8ABAF;font-size:14px}

.tscfg .bar{background:var(--ink);color:#fff;border-radius:10px;padding:13px 18px;display:flex;align-items:center;gap:30px;flex-wrap:wrap}
.tscfg .bar .k{font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:#9DA1A8;display:block}
.tscfg .bar .v{font-family:var(--fd);font-size:18px;font-weight:600}
.tscfg .bar .right{margin-left:auto;text-align:right}

.tscfg .strip{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:15px 18px}
.tscfg .strip h3{font-family:var(--fd);font-size:14px;font-weight:600;margin:0}
.tscfg .strip p{font-size:11.5px;color:var(--ink3);margin:2px 0 13px}
.tscfg .cards{display:flex;gap:10px;overflow-x:auto;padding-bottom:2px}
.tscfg .zcard{flex:0 0 152px;border:1px solid var(--line);border-radius:8px;padding:11px;text-align:left;background:var(--card);transition:.12s}
.tscfg .zcard:hover{border-color:var(--line2)}
.tscfg .zcard.done{border-color:var(--ok);background:#F5FAF7}
.tscfg .zcard.cur{border-color:var(--red);background:var(--red-t)}
.tscfg .zcard .th{height:44px;border-radius:5px;background:#EDECE9;margin-bottom:9px;display:grid;place-items:center;overflow:hidden}
.tscfg .zcard b{display:block;font-size:12.5px;font-weight:500}
.tscfg .zcard small{display:block;font-size:11px;color:var(--ink3);font-family:var(--fm)}
.tscfg .zcard .go{color:var(--red);font-size:11px}

.tscfg .panel{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:18px;position:sticky;top:14px}
.tscfg .panel h2{font-size:17px;margin-bottom:3px}
.tscfg .hint{font-size:12px;color:var(--ink3);line-height:1.5;margin:0 0 14px}
.tscfg .back{background:none;border:none;color:var(--ink3);font-size:11.5px;padding:0 0 9px}
.tscfg .back:hover{color:var(--red)}
.tscfg .opt{width:100%;text-align:left;background:var(--card);border:1px solid var(--line);border-radius:8px;padding:10px 12px;margin-bottom:7px;display:flex;justify-content:space-between;align-items:center;gap:9px;transition:.12s}
.tscfg .opt:hover{border-color:var(--line2)}
.tscfg .opt b{font-weight:500;font-size:13.5px}
.tscfg .opt small{display:block;color:var(--ink3);font-size:11px}
.tscfg .opt .dot{width:12px;height:12px;border-radius:50%;border:1px solid var(--line2);flex:none}
.tscfg .opt.sel{border-color:var(--red);background:var(--red-t)}
.tscfg .opt.sel .dot{border-color:var(--red);background:var(--red);box-shadow:inset 0 0 0 2px #fff}
.tscfg .opt:disabled{opacity:.42;cursor:not-allowed}
.tscfg .btn{background:var(--red);color:#fff;border:none;border-radius:8px;padding:10px 15px;font-weight:500;font-size:13.5px;width:100%}
.tscfg .btn:hover{background:#9E2C26}
.tscfg .btn.ghost{background:transparent;color:var(--ink2);border:1px solid var(--line)}
.tscfg .btn.ghost:hover{background:var(--paper);color:var(--ink)}
.tscfg .btn.link{background:none;border:none;color:var(--ink3);font-size:12px;width:auto;padding:8px 0;display:block;margin:0 auto}
.tscfg .btn.link:hover{color:var(--red)}
.tscfg .btn:disabled{opacity:.38;cursor:not-allowed;background:var(--red)}
.tscfg .fld{margin-bottom:9px}
.tscfg .fld label{display:block;font-size:11.5px;color:var(--ink2);margin-bottom:4px}
.tscfg .fld .box{display:flex;align-items:center;border:1px solid var(--line);border-radius:8px;padding:8px 11px;gap:8px}
.tscfg .fld .box.key{border-color:var(--ink);border-width:1.5px}
.tscfg .fld input{border:none;outline:none;font-family:var(--fm);font-size:14.5px;width:100%;background:transparent;color:var(--ink)}
.tscfg .fld .unit{font-family:var(--fm);font-size:11.5px;color:var(--ink3)}
.tscfg .fld select{border:1px solid var(--line);border-radius:8px;padding:8px 11px;width:100%;font-family:var(--fm);font-size:13.5px;background:var(--card);color:var(--ink);appearance:none;background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='6'><path d='M1 1l4 4 4-4' fill='none' stroke='%2393969B' stroke-width='1.5'/></svg>");background-repeat:no-repeat;background-position:right 11px center}
.tscfg .pair{display:grid;grid-template-columns:1fr 1fr;gap:9px}
.tscfg .err{color:var(--red);font-size:11.5px;margin:-2px 0 9px;display:none}
.tscfg .err.show{display:block}
.tscfg .cfgs{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-bottom:12px}
.tscfg .cfg{border:1px solid var(--line);background:var(--card);border-radius:8px;padding:9px 5px;text-align:center;transition:.12s}
.tscfg .cfg:hover{border-color:var(--line2)}
.tscfg .cfg b{display:block;font-size:11px;font-weight:500;margin-bottom:2px}
.tscfg .cfg small{font-family:var(--fm);font-size:10.5px;color:var(--ink3)}
.tscfg .cfg.sel{border-color:var(--red);border-width:1.5px;background:var(--red-t)}
.tscfg .chips{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px}
.tscfg .chip{border:1px solid var(--line);background:var(--card);border-radius:999px;padding:5px 11px;font-size:11.5px;font-family:var(--fm);color:var(--ink2)}
.tscfg .chip:hover{border-color:var(--line2)}
.tscfg .chip.sel{border-color:var(--red);color:var(--red);background:var(--red-t)}
.tscfg .row{display:flex;justify-content:space-between;align-items:center;padding:9px 0;border-top:1px solid var(--line);font-size:13px}
.tscfg .row .mute{color:var(--ink3)}
.tscfg .row .add{color:var(--red);font-size:11.5px;background:none;border:none;padding:0}
.tscfg .row .edit{background:none;border:none;color:var(--ink3);font-size:11px;padding:0 0 0 8px}
.tscfg .check{color:var(--ok);margin-right:6px}
.tscfg .tot{display:flex;justify-content:space-between;align-items:baseline;padding:13px 0 3px;border-top:1px solid var(--line2)}
.tscfg .tot .v{font-family:var(--fd);font-size:21px;font-weight:600}
.tscfg .note{font-family:var(--fm);font-size:10px;color:var(--ink3);text-align:center;margin-top:9px}
.tscfg .done-ico{width:40px;height:40px;border-radius:50%;background:#E7F3EC;color:var(--ok);display:grid;place-items:center;font-size:18px;margin:0 auto 12px}

@media(max-width:980px){
  .tscfg .shell{grid-template-columns:1fr}
  .tscfg .panel{position:static}
  .tscfg .scene,.tscfg .empty{height:60vh;min-height:360px}
  .tscfg .steps{display:none}
}
@media(prefers-reduced-motion:reduce){.tscfg *{transition:none!important}}
`;
