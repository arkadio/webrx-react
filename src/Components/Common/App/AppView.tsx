import * as React from 'react';
import * as classNames from 'classnames';
import { Grid } from 'react-bootstrap';

import { BaseView } from '../../React/BaseView';
import { ViewMapper } from '../RouteHandler/RouteHandlerView';
import { AlertHostView } from '../Alert/AlertHostView';
import { RouteHandlerView } from '../RouteHandler/RouteHandlerView';
import { PageHeaderView, PageHeaderProps } from '../PageHeader/PageHeaderView';
import { PageFooterView, PageFooterProps } from '../PageFooter/PageFooterView';
import { AppViewModel } from './AppViewModel';
import { ViewMap } from './ViewMap';

import './App.less';

export interface AppProps extends PageHeaderProps, PageFooterProps {
  viewMap?: ViewMapper;
}

export class AppView extends BaseView<AppProps, AppViewModel> {
  public static displayName = 'AppView';

  static defaultProps = {
    viewMap: ViewMap,
  };

  render() {
    const { className, props, rest } = this.restProps(x => {
      const { viewMap, brand, copyright } = x;
      return { viewMap, brand, copyright };
    });

    return (
      <div { ...rest } className={ classNames('App', className) }>
        <div className='float-container'>
          <Grid>
            <AlertHostView viewModel={ this.state.alerts } />
          </Grid>
        </div>
        <PageHeaderView viewModel={ this.state.header } brand={ props.brand } />
        <RouteHandlerView viewModel={ this.state.routeHandler } viewMap={ props.viewMap } />
        <PageFooterView viewModel={ this.state.footer } copyright={ props.copyright } />
      </div>
    );
  }
}
