import { Observable } from 'rxjs';

import { wx, ObservableOrProperty, ReadOnlyProperty, Command } from '../../../WebRx';
import { BaseRoutableViewModel } from '../../React/BaseRoutableViewModel';

export interface SelectableItem {
  isSelected: boolean;
}

export interface ItemsSource<T> {
  items: T[];
}

export interface HierarchicalItemsSource<T extends HierarchicalItemsSource<T>> extends ItemsSource<T> {
}

export function filterHierarchical<T extends HierarchicalItemsSource<T>>(
  item: T,
  regexp: RegExp,
  test: (item: T, r: RegExp) => boolean,
) {
  item.items = (item.items || [])
    .filter(x => filterHierarchical(x, regexp, test));

  return test(item, regexp) || item.items.length > 0;
}

export class BaseListViewModel<TData, TListItem, TRoutingState> extends BaseRoutableViewModel<TRoutingState> {
  public static displayName = 'ListViewModel';

  private readonly items: ReadOnlyProperty<TData[]>;
  public readonly listItems: ReadOnlyProperty<TListItem[]>;
  public readonly selectedItem: ReadOnlyProperty<TListItem | undefined>;

  public readonly selectItem: Command<TListItem | undefined>;
  protected readonly toggleSelection: Command<TListItem>;

  constructor(
    items: ObservableOrProperty<TData[]>,
    listItemSelector: (item: TData) => TListItem,
    public readonly isMultiSelectEnabled = false,
    isRoutingEnabled?: boolean,
  ) {
    super(isRoutingEnabled);

    this.items = this.getProperty(items);
    this.listItems = this
      .whenAny(
        this.items,
        x => x,
      )
      .map(x => (x || []).map(y => listItemSelector(y)))
      .toProperty();

    this.selectItem = this.command<TListItem>();
    this.toggleSelection = this.command<TListItem>();

    if (this.isMultiSelectEnabled === true) {
      this.addSubscription(
        wx
          .whenAny(this.toggleSelection.results, x => x)
          .subscribe(x => {
            const selectable = <SelectableItem><any>x;

            selectable.isSelected = !(selectable.isSelected || false);

            this.notifyChanged();
          }),
      );
    }

    this.selectedItem = wx
      .whenAny(this.selectItem.results, x => x)
      .do(x => {
        // we have to do this here because we need to execute toggleSelection
        // before the new selection is persisted in selectedItem
        if (this.isMultiSelectEnabled === true) {
          this.toggleSelection.execute(x);
        }
      })
      .toProperty();
  }

  public get itemsSource() {
    return this.listItems;
  }

  public get hasItems() {
    return wx
      .whenAny(this.items, x => (x || []).length > 0);
  }

  public isItemSelected(item: TListItem) {
    return (this.isMultiSelectEnabled === true) ?
      (<SelectableItem><any>item).isSelected === true :
      this.selectedItem.value === item;
  }

  public getSelectedItems() {
    return (this.listItems.value || [])
      .filter(x => (<SelectableItem><any>x).isSelected === true);
  }
}

export class ListViewModel<TListItem, TRoutingState> extends BaseListViewModel<TListItem, TListItem, TRoutingState> {
  constructor(
    items: ObservableOrProperty<TListItem[]> = wx.property<TListItem[]>([], false),
    isMultiSelectEnabled?: boolean,
    isRoutingEnabled?: boolean,
  ) {
    super(items, x => x, isMultiSelectEnabled, isRoutingEnabled);
  }
}
