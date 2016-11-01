import * as React from 'react';
import * as classNames from 'classnames';
import { Modal } from 'react-bootstrap';

import './Sidebar.less';

export interface SidebarProps {
  onHide: Function;
  isVisible?: boolean;
  side?: string;
  header?: any;
  children?: any;
}

export class Sidebar extends React.Component<SidebarProps, any> {
  public static displayName = 'Sidebar';

  static defaultProps = {
    side: 'left',
  };

  render() {
    const { className, children, props, rest } = this.restProps(x => {
      const { onHide, isVisible, side, header } = x;
      return { onHide, isVisible, side, header };
    });

    return (
      <Modal { ...rest } className={ classNames('Sidebar', props.side, className) }
        onHide={ this.props.onHide } show={ this.props.isVisible } autoFocus keyboard
      >
        <Modal.Header closeButton>
          <Modal.Title>{ props.header }</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          { children }
        </Modal.Body>
      </Modal>
    );
  }
}
