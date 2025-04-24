import { BaseWidget, GridstackComponent } from 'gridstack/dist/angular';

import { Injectable, reflectComponentType, Type } from '@angular/core';

import { WidgetMetadata } from '../modules/dashboards/widgets/base-widget.decorator';
import { BasezeroriskWidget } from '../modules/dashboards/widgets/BasezeroriskWidget';
import { BackendService } from './backend.service';

export type zeroriskWidgetInfo = {
  widgetType: Type<BaseWidget>;
  metadata: WidgetMetadata;
};

export interface DashboardModel {
  id?: string;
  name?: string;
  json_grid?: string;
  user_id?: string;
}

export interface DashboardUpdateModel {
  name?: string;
  json_grid?: string;
}

@Injectable({
  providedIn: 'root',
})
export class DashboardService extends BackendService {
  public onWidgetClickInComposerCallback?: (component: BasezeroriskWidget<any>) => void;

  private static zeroriskWidgetsMapBySelector: {
    [id: string]: zeroriskWidgetInfo;
  } = {};

  getAllWidgetsSelector(): Array<string> {
    return Object.keys(GridstackComponent.selectorToType)
      .map((x) => reflectComponentType(GridstackComponent.selectorToType[x])?.selector)
      .filter((x) => x != undefined) as Array<string>;
  }

  static InitiatezeroriskWidget(widgetType: Type<BaseWidget>, metadata: WidgetMetadata) {
    DashboardService.zeroriskWidgetsMapBySelector[metadata.id] = {
      widgetType,
      metadata,
    };
  }

  getzeroriskWidgetBySelector(selector: string): zeroriskWidgetInfo {
    return DashboardService.zeroriskWidgetsMapBySelector[selector];
  }

  async CreateDashboard(dashboard: DashboardModel): Promise<DashboardModel> {
    const res = await this.post<DashboardModel>('/dashboards', dashboard);
    return res.body!.data;
  }

  async GetDashboards(skip: number = 0, limit: number = 100): Promise<DashboardModel[]> {
    const res = await this.get<DashboardModel[]>('/dashboards/', {
      skip,
      limit,
    });
    return res.body!.data;
  }

  async GetDashboard(dashboardId: string): Promise<DashboardModel> {
    const res = await this.get<DashboardModel>('/dashboards/' + dashboardId);
    return res.body!.data;
  }

  async UpdateDashboard(dashboardId: string, dashboard: DashboardModel): Promise<DashboardModel> {
    const res = await this.put<DashboardModel>('/dashboards/' + dashboardId, dashboard);
    return res.body!.data;
  }

  async DeleteDashboard(dashboardId: string): Promise<void> {
    await this.delete('/dashboards/' + dashboardId);
  }
}
