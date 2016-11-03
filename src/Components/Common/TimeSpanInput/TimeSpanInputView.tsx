import * as React from 'react';
import { FormGroup, InputGroup, Sizes, FormControl, FormControlProps, DropdownButton, MenuItem, HelpBlock } from 'react-bootstrap';
import { Icon } from 'react-fa';
import * as classNames from 'classnames';

import { BaseView, BaseViewProps } from '../../React/BaseView';
import { BindableInput } from '../BindableInput/BindableInput';
import { TimeSpanInputViewModel } from './TimeSpanInputViewModel';
import { CommandButton } from '../CommandButton/CommandButton';

import './TimeSpanInput.less';

export interface TimeSpanControlProps extends FormControlProps {
  viewModel: TimeSpanInputViewModel;
}

export class TimeSpanControl extends React.Component<any, any> {
  render() {
    const { className, props, rest } = this.restProps(x => {
      const { viewModel } = x;
      return { viewModel };
    });

    return (
      <BindableInput property={ props.viewModel.text }>
        <FormControl { ...rest } className={ classNames('TimeSpanControl', className) } type='text' />
      </BindableInput>
    );
  }
}

export interface TimeSpanInputProps extends BaseViewProps {
  // FormGroupProps
  bsClass?: string;
  bsSize?: Sizes;
  controlId?: string;
  validationState?: 'success' | 'warning' | 'error';

  // FormControlProps
  componentClass?: React.ReactType;

  children?: TimeSpanControl;
}

export class TimeSpanInputView extends BaseView<TimeSpanInputProps, TimeSpanInputViewModel> {
  public static displayName = 'TimeSpanInputView';

  static defaultProps = {
  };

  updateOn() {
    return [
      this.state.unit.changed,
      this.state.hasError.changed,
    ];
  }

  render() {
    const { className, props, rest } = this.restProps(x => {
      const { bsClass, bsSize, controlId, validationState } = x;
      return { bsClass, bsSize, controlId, validationState };
    });

    props.validationState = props.validationState || (this.state.hasError() ? 'error' : null);

    return (
      <FormGroup { ...rest } { ...props } className={ classNames('TimeSpanInput', className) }>
        <InputGroup>
          { this.renderControl() }
          <InputGroup.Button>
            { this.renderDropdown() }
            <CommandButton className='TimeSpanInput-adjustButton' command={ this.state.adjust } commandParameter={ 1 }>
              <Icon name='chevron-up'/>
            </CommandButton>
            <CommandButton className='TimeSpanInput-adjustButton' command={ this.state.adjust } commandParameter={ -1 }>
              <Icon name='chevron-down'/>
            </CommandButton>
          </InputGroup.Button>
        </InputGroup>
        <FormControl.Feedback />
        { this.renderHelp() }
      </FormGroup>
    );
  }

  private renderControl() {
    return this.renderConditional(
      this.props.children != null,
      () => this.props.children,
      () => (
        <TimeSpanControl viewModel={ this.state } componentClass={ this.props.componentClass } placeholder='Type in a timespan, or use the controls on the right...' />
      )
    );
  }

  private renderDropdown() {
    return (
      <DropdownButton id={ `TimeSpanInput-units-${ this.props.id }` } className='TimeSpanInput-unitDropdown'
        title={ this.state.unit().name } bsSize={ this.props.bsSize }
        onSelect={ this.bindEventToCommand(x => x.setUnit) }
      >
        {
          this.state.units
            .map(x => (
              <MenuItem key={ x.type } eventKey={ x } active={ x.type === this.state.unit().type }>
                { x.name }
              </MenuItem>
            ))
        }
      </DropdownButton>
    );
  }

  private renderHelp() {
    return this.renderConditional(this.state.hasError, () => (
      <HelpBlock>
        {
          this.renderConditional(
            String.isNullOrEmpty(this.state.text()) === true,
            () => 'Duration is required.',
            () => 'Invalid Duration Format.'
          )
        }
      </HelpBlock>
    ));
  }
}
