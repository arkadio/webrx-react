import * as React from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import * as classNames from 'classnames';

import { BaseView, BaseViewProps } from '../../React/BaseView';
import { TabsViewModel } from './TabsViewModel';
import { renderConditional } from '../../React/RenderHelpers';

import './Tabs.less';

type ReadonlyTabsViewModel<TData> = Readonly<TabsViewModel<TData>>;

export class TabRenderTemplate<TData> {
  public static displayName = 'TabViewTemplate';

  constructor(
    protected titleSelector: (item: TData, index: number, viewModel: ReadonlyTabsViewModel<TData>, view: TabsView) => string,
    protected renderItem: (item: TData, index: number, viewModel: ReadonlyTabsViewModel<TData>, view: TabsView) => any = x => x.toString(),
    protected keySelector: (item: TData, index: number, viewModel: ReadonlyTabsViewModel<TData>, view: TabsView) => any = (x, i) => i,
    protected renderTemplateContainer?: (content: () => any, item: TData, index: number, viewModel: ReadonlyTabsViewModel<TData>, view: TabsView) => any,
  ) {
    if (this.renderTemplateContainer == null) {
      this.renderTemplateContainer = this.renderDefaultTemplateContainer;
    }
  }

  protected renderDefaultTemplateContainer(content: () => any, item: TData, index: number, viewModel: ReadonlyTabsViewModel<TData>, view: TabsView) {
    return (
      <Tab key={ this.keySelector(item, index, viewModel, view) } title={ this.titleSelector(item, index, viewModel, view) } eventKey={ index }>
        { renderConditional(index === viewModel.selectedIndex(), content) }
      </Tab>
    );
  }

  public render(viewModel: ReadonlyTabsViewModel<TData>, view: TabsView) {
    return viewModel.tabs
      .toArray()
      .map((x, i) => {
        return this.renderTemplateContainer(() => this.renderItem(x, i, viewModel, view), x, i, viewModel, view);
      });
  }
}

// NOTE: id is required for tab (belongs to HTMLAttributes)
export interface TabsProps extends BaseViewProps {
  template?: TabRenderTemplate<any>;
  children?: Tab[];
}

export class TabsView extends BaseView<TabsProps, TabsViewModel<any>> {
  public static displayName = 'TabsView';

  updateOn() {
    return [
      this.state.tabs.listChanged,
      this.state.selectedIndex.changed,
    ];
  }

  render() {
    const { className, rest } = this.restProps(x => {
      const { template, children } = x;
      return { template, children };
    });

    return (
      <div { ...rest } className={ classNames('Tabs', className) }>
        { this.renderTabs() }
      </div>
    );
  }

  private renderTabs() {
    return this.renderConditional(
      this.props.template == null,
      () => this.renderStaticTabs(),
      () => this.renderDynamicTabs(),
    );
  }

  private renderStaticTabs() {
    return (
      <Tabs id={ this.props.id } unmountOnExit activeKey={ this.state.selectedIndex() }
        onSelect={ this.bindEventToCommand(x => x.selectIndex) }
      >
        {
          React.Children
            .map(this.props.children, (x: any, i: number) => {
              return React.cloneElement(x, { eventKey: i });
            })
        }
      </Tabs>
    );
  }

  private renderDynamicTabs() {
    return (
      <Tabs id={ this.props.id } activeKey={ this.state.selectedIndex() }
        onSelect={ this.bindEventToCommand(x => x.selectIndex) }
      >
        { this.props.template.render(this.state, this) }
      </Tabs>
    );
  }
}
