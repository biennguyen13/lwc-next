import {
	CustomSeriesPricePlotValues,
	ICustomSeriesPaneView,
	ICustomSeriesPaneRenderer,
	PaneRendererCustomData,
	WhitespaceData,
	Time,
	BitmapCoordinatesRenderingScope,
	CanvasRenderingTarget2D,
	PriceToCoordinateConverter,
} from 'lightweight-charts';

export interface HLCAreaData {
	time: string | number;
	high: number;
	low: number;
	close: number;
}

export interface HLCAreaSeriesOptions {
	highLineColor: string;
	lowLineColor: string;
	closeLineColor: string;
	areaBottomColor: string;
	areaTopColor: string;
	highLineWidth: number;
	lowLineWidth: number;
	closeLineWidth: number;
}

export const defaultOptions: HLCAreaSeriesOptions = {
	highLineColor: 'rgba(242, 54, 69, 0.2)',
	lowLineColor: 'rgba(242, 54, 69, 0.2)',
	closeLineColor: 'rgba(242, 54, 69, 0.2)',
	areaBottomColor: 'rgba(242, 54, 69, 0.2)',
	areaTopColor: 'rgba(242, 54, 69, 0.2)',
	highLineWidth: 2,
	lowLineWidth: 2,
	closeLineWidth: 2,
} as const;

export class HLCAreaSeries<TData extends HLCAreaData>
	implements ICustomSeriesPaneView<Time, TData, HLCAreaSeriesOptions>
{
	_renderer: HLCAreaSeriesRenderer<TData>;

	constructor() {
		this._renderer = new HLCAreaSeriesRenderer();
	}

	priceValueBuilder(plotRow: TData): CustomSeriesPricePlotValues {
		return [plotRow.low, plotRow.high, plotRow.close];
	}

	isWhitespace(data: TData | WhitespaceData): data is WhitespaceData {
		return (data as Partial<TData>).close === undefined;
	}

	renderer(): HLCAreaSeriesRenderer<TData> {
		return this._renderer;
	}

	update(
		data: PaneRendererCustomData<Time, TData>,
		options: HLCAreaSeriesOptions
	): void {
		this._renderer.update(data, options);
	}

	defaultOptions() {
		return defaultOptions;
	}
}

interface HLCAreaBarItem {
	x: number;
	high: number;
	low: number;
	close: number;
}

export class HLCAreaSeriesRenderer<TData extends HLCAreaData>
	implements ICustomSeriesPaneRenderer
{
	_data: PaneRendererCustomData<Time, TData> | null = null;
	_options: HLCAreaSeriesOptions | null = null;

	draw(
		target: CanvasRenderingTarget2D,
		priceConverter: PriceToCoordinateConverter
	): void {
		target.useBitmapCoordinateSpace(scope =>
			this._drawImpl(scope, priceConverter)
		);
	}

	update(
		data: PaneRendererCustomData<Time, TData>,
		options: HLCAreaSeriesOptions
	): void {
		this._data = data;
		this._options = options;
	}

	_drawImpl(
		renderingScope: BitmapCoordinatesRenderingScope,
		priceToCoordinate: PriceToCoordinateConverter
	): void {
		if (
			this._data === null ||
			this._data.bars.length === 0 ||
			this._data.visibleRange === null ||
			this._options === null
		) {
			return;
		}
		const options = this._options;
		const bars: HLCAreaBarItem[] = this._data.bars.map(bar => {
			return {
				x: bar.x * renderingScope.horizontalPixelRatio,
				high: priceToCoordinate(bar.originalData.high)! * renderingScope.verticalPixelRatio,
				low: priceToCoordinate(bar.originalData.low)! * renderingScope.verticalPixelRatio,
				close: priceToCoordinate(bar.originalData.close)! * renderingScope.verticalPixelRatio,
			};
		});

		const ctx = renderingScope.context;
		ctx.beginPath();
		const lowLine = new Path2D();
		const highLine = new Path2D();
		const closeLine = new Path2D();
		const firstBar = bars[this._data.visibleRange.from];
		lowLine.moveTo(firstBar.x, firstBar.low);
		highLine.moveTo(firstBar.x, firstBar.high);
		for (
			let i = this._data.visibleRange.from + 1;
			i < this._data.visibleRange.to;
			i++
		) {
			const bar = bars[i];
			lowLine.lineTo(bar.x, bar.low);
			highLine.lineTo(bar.x, bar.high);
		}

		// We draw the close line in reverse so that it is
		// to reuse the Path2D to create the filled areas.
		const lastBar = bars[this._data.visibleRange.to - 1];
		closeLine.moveTo(lastBar.x, lastBar.close);
		for (
			let i = this._data.visibleRange.to - 2;
			i >= this._data.visibleRange.from;
			i--
		) {
			const bar = bars[i];
			closeLine.lineTo(bar.x, bar.close);
		}

		const topArea = new Path2D(highLine);
		topArea.lineTo(lastBar.x, lastBar.close);
		topArea.addPath(closeLine);
		topArea.lineTo(firstBar.x, firstBar.high);
		topArea.closePath();
		ctx.fillStyle = options.areaTopColor;
		ctx.fill(topArea);

		const bottomArea = new Path2D(lowLine);
		bottomArea.lineTo(lastBar.x, lastBar.close);
		bottomArea.addPath(closeLine);
		bottomArea.lineTo(firstBar.x, firstBar.low);
		bottomArea.closePath();
		ctx.fillStyle = options.areaBottomColor;
		ctx.fill(bottomArea);

		ctx.lineJoin = 'round';
		ctx.strokeStyle = options.lowLineColor;
		ctx.lineWidth = options.lowLineWidth * renderingScope.verticalPixelRatio;
		ctx.stroke(lowLine);
		ctx.strokeStyle = options.highLineColor;
		ctx.lineWidth = options.highLineWidth * renderingScope.verticalPixelRatio;
		ctx.stroke(highLine);
		ctx.strokeStyle = options.closeLineColor;
		ctx.lineWidth = options.closeLineWidth * renderingScope.verticalPixelRatio;
		ctx.stroke(closeLine);
	}
} 