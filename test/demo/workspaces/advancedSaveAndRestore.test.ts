import {Workspace} from '../../../src/client/types';
import {assertAllTabbed, assertGrouped, assertTabbed} from '../../provider/utils/assertions';
import {delay} from '../../provider/utils/delay';
import {testParameterized} from '../utils/parameterizedTestUtils';
import {layoutsClientPromise} from '../utils/serviceUtils';

// Specific test for issue in SERVICE-324. Uses the (very long) workspace json at the end of the file.
testParameterized(
    `Restoring snap/tab layout twice destroys tabgroups`,
    [
        {},
    ],
    async t => {
        const {workspaces} = await layoutsClientPromise;

        const identities = testWorkspace.apps.map(app => ({uuid: app.uuid, name: app.mainWindow.name}));
        const windows = identities.map(id => fin.Window.wrapSync(id));
        await workspaces.restore(testWorkspace);
        await delay(1000);

        await assertGrouped(t, ...windows);
        await assertAllTabbed(t, windows[3], windows[4], windows[1]);
        await assertAllTabbed(t, windows[0], windows[2]);

        await t.notThrows(workspaces.restore(testWorkspace));

        await delay(1000);

        await assertGrouped(t, ...windows);
        await assertAllTabbed(t, windows[3], windows[4], windows[1]);
        await assertAllTabbed(t, windows[0], windows[2]);
    });


// Easier and less error-prone to use the workspace json directly rather than building manually with robot moves
const testWorkspace: Workspace = {
    'apps': [
        {
            'childWindows': [],
            'confirmed': false,
            'initialOptions': {
                'mainWindowOptions': {'autoShow': true, 'defaultCentered': true, 'defaultHeight': 300, 'defaultWidth': 400, 'saveWindowState': false},
                'name': 'App0',
                'url': 'http://localhost:1337/demo/tabbing/default.html',
                'uuid': 'App0'
            },
            'mainWindow': {
                'bottom': 1183,
                'frame': true,
                'height': 233,
                'info': {
                    'canNavigateBack': false,
                    'canNavigateForward': false,
                    'preloadScripts': [],
                    'title': 'localhost:1337/demo/tabbing/default.html',
                    'url': 'http://localhost:1337/demo/tabbing/default.html'
                },
                'isShowing': true,
                'isTabbed': true,
                'left': 559,
                'name': 'App0',
                'right': 945,
                'state': 'normal',
                'top': 950,
                'uuid': 'App0',
                'width': 386,
                'windowGroup':
                    [{'name': 'App2', 'uuid': 'App2'}, {'name': 'App3', 'uuid': 'App3'}, {'name': 'App1', 'uuid': 'App1'}, {'name': 'App4', 'uuid': 'App4'}]
            },
            'uuid': 'App0'
        },
        {
            'childWindows': [],
            'confirmed': false,
            'initialOptions': {
                'mainWindowOptions': {'autoShow': true, 'defaultCentered': true, 'defaultHeight': 300, 'defaultWidth': 400, 'saveWindowState': false},
                'name': 'App1',
                'url': 'http://localhost:1337/demo/tabbing/default.html',
                'uuid': 'App1'
            },
            'mainWindow': {
                'bottom': 1183,
                'frame': true,
                'height': 233,
                'info': {
                    'canNavigateBack': false,
                    'canNavigateForward': false,
                    'preloadScripts': [],
                    'title': 'localhost:1337/demo/tabbing/default.html',
                    'url': 'http://localhost:1337/demo/tabbing/default.html'
                },
                'isShowing': true,
                'isTabbed': true,
                'left': 945,
                'name': 'App1',
                'right': 1331,
                'state': 'normal',
                'top': 950,
                'uuid': 'App1',
                'width': 386,
                'windowGroup':
                    [{'name': 'App2', 'uuid': 'App2'}, {'name': 'App0', 'uuid': 'App0'}, {'name': 'App3', 'uuid': 'App3'}, {'name': 'App4', 'uuid': 'App4'}]
            },
            'uuid': 'App1'
        },
        {
            'childWindows': [],
            'confirmed': false,
            'initialOptions': {
                'mainWindowOptions': {'autoShow': true, 'defaultCentered': true, 'defaultHeight': 300, 'defaultWidth': 400, 'saveWindowState': false},
                'name': 'App2',
                'url': 'http://localhost:1337/demo/tabbing/default.html',
                'uuid': 'App2'
            },
            'mainWindow': {
                'bottom': 1183,
                'frame': true,
                'height': 233,
                'info': {
                    'canNavigateBack': false,
                    'canNavigateForward': false,
                    'preloadScripts': [],
                    'title': 'localhost:1337/demo/tabbing/default.html',
                    'url': 'http://localhost:1337/demo/tabbing/default.html'
                },
                'isShowing': true,
                'isTabbed': true,
                'left': 559,
                'name': 'App2',
                'right': 945,
                'state': 'normal',
                'top': 950,
                'uuid': 'App2',
                'width': 386,
                'windowGroup':
                    [{'name': 'App0', 'uuid': 'App0'}, {'name': 'App3', 'uuid': 'App3'}, {'name': 'App1', 'uuid': 'App1'}, {'name': 'App4', 'uuid': 'App4'}]
            },
            'uuid': 'App2'
        },
        {
            'childWindows': [],
            'confirmed': false,
            'initialOptions': {
                'mainWindowOptions': {'autoShow': true, 'defaultCentered': true, 'defaultHeight': 300, 'defaultWidth': 400, 'saveWindowState': false},
                'name': 'App3',
                'url': 'http://localhost:1337/demo/tabbing/default.html',
                'uuid': 'App3'
            },
            'mainWindow': {
                'bottom': 1183,
                'frame': true,
                'height': 233,
                'info': {
                    'canNavigateBack': false,
                    'canNavigateForward': false,
                    'preloadScripts': [],
                    'title': 'localhost:1337/demo/tabbing/default.html',
                    'url': 'http://localhost:1337/demo/tabbing/default.html'
                },
                'isShowing': true,
                'isTabbed': true,
                'left': 945,
                'name': 'App3',
                'right': 1331,
                'state': 'normal',
                'top': 950,
                'uuid': 'App3',
                'width': 386,
                'windowGroup':
                    [{'name': 'App2', 'uuid': 'App2'}, {'name': 'App0', 'uuid': 'App0'}, {'name': 'App1', 'uuid': 'App1'}, {'name': 'App4', 'uuid': 'App4'}]
            },
            'uuid': 'App3'
        },
        {
            'childWindows': [],
            'confirmed': false,
            'initialOptions': {
                'mainWindowOptions': {'autoShow': true, 'defaultCentered': true, 'defaultHeight': 300, 'defaultWidth': 400, 'saveWindowState': false},
                'name': 'App4',
                'url': 'http://localhost:1337/demo/tabbing/default.html',
                'uuid': 'App4'
            },
            'mainWindow': {
                'bottom': 1183,
                'frame': true,
                'height': 233,
                'info': {
                    'canNavigateBack': false,
                    'canNavigateForward': false,
                    'preloadScripts': [],
                    'title': 'localhost:1337/demo/tabbing/default.html',
                    'url': 'http://localhost:1337/demo/tabbing/default.html'
                },
                'isShowing': true,
                'isTabbed': true,
                'left': 945,
                'name': 'App4',
                'right': 1331,
                'state': 'normal',
                'top': 950,
                'uuid': 'App4',
                'width': 386,
                'windowGroup':
                    [{'name': 'App2', 'uuid': 'App2'}, {'name': 'App0', 'uuid': 'App0'}, {'name': 'App3', 'uuid': 'App3'}, {'name': 'App1', 'uuid': 'App1'}]
            },
            'uuid': 'App4'
        }
    ],
    'monitorInfo': {
        'deviceScaleFactor': 1,
        'dpi': {'x': 96, 'y': 96},
        'nonPrimaryMonitors': [],
        'primaryMonitor': {
            'available': {'dipRect': {'bottom': 1400, 'left': 0, 'right': 2560, 'top': 0}, 'scaledRect': {'bottom': 1400, 'left': 0, 'right': 2560, 'top': 0}},
            'availableRect': {'bottom': 1400, 'left': 0, 'right': 2560, 'top': 0},
            'deviceId': '\\\\?\\DISPLAY#PRL5000#5&140b9d70&0&UID0#{e6f07b5f-ee97-4a90-b076-33f57bf4eaa7}',
            'deviceScaleFactor': 1,
            'displayDeviceActive': true,
            'dpi': {'x': 96, 'y': 96},
            'monitor': {'dipRect': {'bottom': 1440, 'left': 0, 'right': 2560, 'top': 0}, 'scaledRect': {'bottom': 1440, 'left': 0, 'right': 2560, 'top': 0}},
            'monitorRect': {'bottom': 1440, 'left': 0, 'right': 2560, 'top': 0},
            'name': 1
        },
        'reason': 'api-query',
        'taskBar': {
            'dipRect': {'bottom': 1440, 'left': 0, 'right': 2560, 'top': 1400},
            'edge': 'bottom',
            'rect': {'bottom': 1440, 'left': 0, 'right': 2560, 'top': 1400},
            'scaledRect': {'bottom': 1440, 'left': 0, 'right': 2560, 'top': 1400}
        },
        'virtualScreen': {
            'bottom': 1440,
            'dipRect': {'bottom': 1440, 'left': 0, 'right': 2560, 'top': 0},
            'left': 0,
            'right': 2560,
            'scaledRect': {'bottom': 1440, 'left': 0, 'right': 2560, 'top': 0},
            'top': 0
        }
    },
    'schemaVersion': '1.0.0',
    'tabGroups': [
        {
            'groupInfo': {
                'active': {'name': 'App4', 'uuid': 'App4'},
                'config': {'height': 60, 'url': 'http://localhost:1337/provider/tabbing/tabstrip/tabstrip.html'},
                'dimensions': {'appHeight': 233, 'width': 386, 'x': 945, 'y': 890},
                'state': 'normal'
            },
            'tabs': [{'name': 'App3', 'uuid': 'App3'}, {'name': 'App1', 'uuid': 'App1'}, {'name': 'App4', 'uuid': 'App4'}]
        },
        {
            'groupInfo': {
                'active': {'name': 'App0', 'uuid': 'App0'},
                'config': {'height': 60, 'url': 'http://localhost:1337/provider/tabbing/tabstrip/tabstrip.html'},
                'dimensions': {'appHeight': 233, 'width': 386, 'x': 559, 'y': 890},
                'state': 'normal'
            },
            'tabs': [{'name': 'App0', 'uuid': 'App0'}, {'name': 'App2', 'uuid': 'App2'}]
        }
    ],
    'type': 'layout'
} as Workspace;
