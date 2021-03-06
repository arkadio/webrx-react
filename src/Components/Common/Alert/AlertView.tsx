import * as React from 'react';
import { Alert } from 'react-bootstrap';

import { BaseView, BaseViewProps } from '../../React';
import { AlertViewModel } from './AlertViewModel';

export interface AlertProps extends BaseViewProps {
}

export class AlertView extends BaseView<AlertProps, AlertViewModel> {
  public static displayName = 'AlertView';

  render() {
    const { className, rest } = this.restProps();

    return (
      <div { ...rest } className={ this.classNames('Alert', className) }>
        <Alert bsStyle={ this.state.style } onDismiss={ this.bindEventToCommand(x => x.dismiss) }>
          <div className='Alert-header'>{ this.state.header }</div>
          { this.renderAlertContent() }
        </Alert>
      </div>
    );
  }

  private renderAlertContent() {
    return this.renderConditional(
      String.isString(this.state.content),
      () => (
        <div className='Alert-content'>
          <div className='Alert-text' dangerouslySetInnerHTML={ { __html: this.state.content } }>
          </div>
        </div>
      ),
      () => this.state.content,
    );
  }
}
