import {Rectangle} from '../snapanddock/utils/RectUtils';
import {Debounced} from '../snapanddock/utils/Debounced';
import {Point} from '../snapanddock/utils/PointUtils';
import {WindowState} from '../../client/workspaces';

import {DesktopModel} from './DesktopModel';
import {DesktopEntity} from './DesktopEntity';
import {DesktopSnapGroup} from './DesktopSnapGroup';
import {MonitorAssignmentCalculator, SnapGroupResult, EntityResult} from './MonitorAssignmentCalculator';
import {DesktopTabGroup} from './DesktopTabGroup';

export class MonitorAssignmentValidator {
    private _model: DesktopModel;

    private _validate: Debounced<() => Promise<void>, MonitorAssignmentValidator, []>;

    public constructor(model: DesktopModel) {
        this._model = model;

        this._validate = new Debounced(this.validateInternal, this);
    }

    public async validate(): Promise<void> {
        return this._validate.call();
    }

    public async validateInternal(): Promise<void> {
        const calculator = new MonitorAssignmentCalculator(this._model.monitors);

        const snapGroups = this.getSnapGroups();
        const entities = this.getEntities();

        const snapGroupResults = snapGroups.map(snapGroup => calculator.getMovedSnapGroupRectangles(snapGroup));
        const entityResults = entities.map(entity => calculator.getMovedEntityRectangle(entity));

        const moveSnapGroupsPromise = this.applySnapGroupResults(snapGroups, snapGroupResults);
        const moveEntitiesPromise = this.applyEntityResults(entities, entityResults);

        await Promise.all([moveSnapGroupsPromise, moveEntitiesPromise]);
    }

    private getSnapGroups(): DesktopSnapGroup[] {
        return this._model.snapGroups.filter(snapGroup => snapGroup.isNonTrivial());
    }

    private getEntities(): DesktopEntity[] {
        const trivalSnapGroup = this._model.snapGroups.filter(snapGroup => !snapGroup.isNonTrivial());

        // Trivial snap groups should contain exactly one entity
        return trivalSnapGroup.map(trivalSnapGroup => trivalSnapGroup.entities[0]);
    }

    private async applySnapGroupResults(snapGroups: DesktopSnapGroup[], snapGroupResults: SnapGroupResult[]): Promise<void> {
        await Promise.all(snapGroupResults.map(async (snapGroupResult, snapGroupIndex : number) => {
            const snapGroup = snapGroups[snapGroupIndex];

            await this.applySnapGroupResult(snapGroup, snapGroupResult.groupRectangle);

            // Apply results to each entity in snapgroup, as we may want to move it independently from group
            await this.applyEntityResults(snapGroup.entities, snapGroupResult.entityResults);
        }));
    }

    private async applyEntityResults(entities: DesktopEntity[], entityResults: EntityResult[]): Promise<void> {
        await Promise.all(entityResults.map(async (rectangle: Rectangle, entityIndex: number) => {
            const entity = entities[entityIndex];
            return this.applyEntityResult(entity, rectangle);
        }));
    }

    private async applySnapGroupResult(snapGroup: DesktopSnapGroup, rectangle: Rectangle): Promise<void> {
        const center = snapGroup.center;

        const offset = {x: rectangle.center.x - center.x, y: rectangle.center.y - center.y};

        if (offset.x !== 0 || offset.y !== 0) {
            await snapGroup.applyOffset(offset);
        }
    }

    private async applyEntityResult(entity: DesktopEntity, rectangle: Rectangle): Promise<void> {
        const offset = this.calculateOffset(entity, rectangle);

        if (offset.x !== 0 || offset.y !== 0) {
            if (entity.snapGroup.isNonTrivial()) {
                await entity.setSnapGroup(new DesktopSnapGroup());
            }

            const oldState = entity.currentState.state;
            let restoredState: WindowState | undefined;

            // Things get weird with tabs if we mess with them while minimized, and we'll want to re-maximize maximized windows
            // to the correct screen, so always restore
            if (oldState !== 'normal') {
                await entity.restore();
                await entity.sync();

                // Windows may have moved the tabgroup on restore to bring it back on-screen itself, so revalidate
                if (entity instanceof DesktopTabGroup) {
                    await entity.validate();
                }

                restoredState = entity.currentState.state;
            }

            // Windows may have moved the entity on restore to bring it back on-screen itself, so recalculate the offset. Note this
            // will restore a maximized window
            await entity.applyOffset(this.calculateOffset(entity, rectangle), rectangle.halfSize);

            // If the window was maximized even after being restored, it was a minimized, maximized window, so maximize before
            // we re-minimize
            if (restoredState === 'maximized') {
                await entity.maximize();
            }

            if (oldState !== 'normal') {
                await oldState === 'maximized' ? entity.maximize() : entity.minimize();
            }
        }
    }

    private calculateOffset(entity: DesktopEntity, rectangle: Rectangle): Point<number> {
        const center = entity.normalBounds.center;
        return {x: rectangle.center.x - center.x, y: rectangle.center.y - center.y};
    }
}
