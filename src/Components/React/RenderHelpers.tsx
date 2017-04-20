import * as React from 'react';
import { findDOMNode } from 'react-dom';
import { Grid } from 'react-bootstrap';
import { Enumerable } from 'ix';

import { wx } from '../../WebRx';
import { Loading } from '../Common/Loading/Loading';
import { ValueComparison, ValueComparer } from '../../Utils/Compare';

export function renderEnumerable<T>(
  source: T[] | Enumerable<T> | undefined,
  selector: (item: T, index: number, items: T[]) => any = item => item,
  projector: (items: T[]) => any = items => items,
  sortKey?: (item: T) => any,
  sortComparer: ValueComparison<T> = ValueComparer.DefaultComparison,
  defaultSelector: () => any | null = () => null,
) {
  if (source == null) {
    source = Enumerable.empty<T>();
  }
  else if (Array.isArray(source)) {
    source = source.asEnumerable();
  }

  if (sortKey != null) {
    source = source
      .orderBy(sortKey, sortComparer);
  }

  return projector(
    source
      .defaultIfEmpty(defaultSelector())
      .filter(x => x != null)
      .toArray()
      .map((x, i, a) => selector(x, i, a)),
  );
}

export function renderConditional(
  condition: wx.IObservableProperty<boolean> | boolean | undefined,
  trueContent: () => any,
  falseContent: () => any = () => null,
) {
  return (condition == null ? false : (typeof condition === 'boolean' ? condition : condition())) ?
    trueContent() :
    falseContent();
}

export function renderNullable<T>(element: T | undefined, notNullContent: (x: T) => any, nullContent?: () => any, constraint?: (x: T) => boolean) {
  return renderConditional(
    element != null && (constraint == null || constraint(element)),
    () => notNullContent(element as T),
    nullContent,
  );
}

export function renderLoadable(
  isLoading: wx.IObservableProperty<boolean> | boolean | undefined,
  loadingComponent: any,
  loadedComponent?: any,
) {
  const loadingComponentType = typeof loadingComponent;

  if (loadingComponentType === 'string') {
    const text = loadingComponent;

    loadingComponent = () => (
      <Loading text={ text } />
    );
  }
  else if (loadingComponentType === 'object' && React.isValidElement(loadingComponent) === false) {
    const props = loadingComponent;

    loadingComponent = () => (
      <Loading { ...props } />
    );
  }

  return this.renderConditional(isLoading, loadingComponent, loadedComponent);
}

export function renderSizedLoadable(
  isLoading: wx.IObservableProperty<boolean> | boolean | undefined,
  text: string,
  fontSize: number | string,
  loadedComponent?: any,
) {
  return this.renderLoadable(isLoading, {
    text,
    fontSize,
  }, loadedComponent);
}

export function renderGridLoadable(
  isLoading: wx.IObservableProperty<boolean> | boolean | undefined,
  text: string,
  fontSize: number | string,
  loadedComponent?: any,
) {
  return this.renderLoadable(isLoading, {
    text,
    fontSize,
    componentClass: Grid,
  }, loadedComponent);
}

/**
 * Focus a react instance upon mounting
 * i.e., <Elem ref={ (x: React.ReactInstance) => this.focusElement(x) } />
 */
export function focusElement(instance: React.ReactInstance) {
  const elem = findDOMNode<HTMLElement>(instance);

  if (elem != null) {
    elem.focus();
  }
}
