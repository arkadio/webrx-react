'use strict';

import * as wx from 'webrx';

import { getLogger } from '../Utils/Logging/LogManager';
import ObservableApi from './ObservableApi';

export class BaseModel<T> {
  constructor(model: T) {
    Object.assign(this, model);
  }
}

export abstract class BaseStore<T extends ObservableApi> {
  public static displayName = 'BaseStore';

  protected logger = getLogger(BaseStore.displayName);

  constructor(public api: wx.Lazy<T>) {
    this.logger.debug('Store Created');
  }

  private getNonNullParams(params?: any) {
    return params == null ? null : JSON.parse(JSON.stringify(params));
  }

  protected getObservable<T>(action: string, params?: any, options?: wx.IHttpClientOptions, baseUri?: string) {
    return this.api.value
      .getObservable<T>(action, this.getNonNullParams(params), options, baseUri);
  }
}

export default BaseStore;
