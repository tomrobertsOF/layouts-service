import robot from 'robotjs';
import {_Window} from 'hadouken-js-adapter/out/types/src/api/window/window';

import {createChildWindow} from '../provider/utils/createChildWindow';
import {getBounds} from '../provider/utils/getBounds';
import {dragWindowTo} from '../provider/utils/dragWindowTo';
import {delay} from '../provider/utils/delay';
import {dragWindowAndHover} from '../provider/utils/dragWindowAndHover';

let win: _Window;

test.each([{x: 0, y: 0}, {x: 100, y: 100}, {x: 300, y: 50}, {x: 200, y: 300}])('dragWindowAndHover: %j', async (offset: {x: number, y:number}) => {
    win = await createChildWindow({
        url: 'http://localhost:1337/demo/popup.html',
        autoShow: true,
        saveWindowState: false,
        defaultTop: 100,
        defaultLeft: 100,
        defaultWidth: 300,
        defaultHeight: 200
    });

    const boundsBefore = await getBounds(win);
    await dragWindowAndHover(win, boundsBefore.left + offset.x, boundsBefore.top + offset.y);
    await delay(200);
    robot.mouseToggle('up');

    const boundsAfter = await getBounds(win);

    expect({x: boundsAfter.left - boundsBefore.left, y: boundsAfter.top - boundsBefore.top}).toEqual({x: offset.x, y: offset.y});
});

test.each([{x: 0, y: 0}, {x: 100, y: 100}, {x: 300, y: 50}, {x: 200, y: 300}])('dragWindowTo: %j', async (offset: {x: number, y:number}) => {
    win = await createChildWindow({
        url: 'http://localhost:1337/demo/popup.html',
        autoShow: true,
        saveWindowState: false,
        defaultTop: 100,
        defaultLeft: 100,
        defaultWidth: 300,
        defaultHeight: 200
    });

    const boundsBefore = await getBounds(win);
    await dragWindowTo(win, boundsBefore.left + offset.x, boundsBefore.top + offset.y);

    const boundsAfter = await getBounds(win);

    expect({x: boundsAfter.left - boundsBefore.left, y: boundsAfter.top - boundsBefore.top}).toEqual({x: offset.x, y: offset.y});
});

afterEach(async () =>{
    await win.close(true).catch(() => {});
    await delay(100);
});
