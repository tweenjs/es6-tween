declare namespace TWEEN {
	export function autoPlay(state: boolean): void;
	export function update (time: number, preserve?: boolean): boolean;
	export class Tween {
		constructor (node: any, object?: any): any;
	}
}