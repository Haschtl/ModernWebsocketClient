import cogoToast from 'cogo-toast';
import { MouseEventHandler } from 'react';


export type Options = Partial<{
	hideAfter: number;
	position:
		| 'top-left'
		| 'top-center'
		| 'top-right'
		| 'bottom-left'
		| 'bottom-center'
		| 'bottom-right';
	heading: string;
	role: string;
	toastContainerID: string;
	renderIcon: Function;
	bar: Partial<{
		size: string;
		style: 'solid' | 'dashed' | 'dotted';
		color: string;
	}>;
	onClick: MouseEventHandler;
}>;


export function error(text: string, options?:Options) {
    const { hide } = cogoToast.error(text, {
        onClick: () => {
          if(hide !== undefined){
          hide();}
        },
        ...options
      });
}


export function warn(text: string, options?:Options) {
    const { hide } = cogoToast.warn(text, {
        onClick: () => {
          if(hide !== undefined){
          hide();}
        },
        ...options
      });
}

export function info(text: string, options?:Options) {
    const { hide } = cogoToast.info(text, {
        onClick: () => {
          if(hide !== undefined){
          hide();}
        },
        ...options
      });
}

export function success(text: string, options?:Options) {
    const { hide } = cogoToast.success(text, {
        onClick: () => {
          if(hide !== undefined){
          hide();}
        },
        ...options
      });
}