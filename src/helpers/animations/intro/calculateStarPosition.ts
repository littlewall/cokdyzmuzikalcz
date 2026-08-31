export interface StarBounds {
    height: number,
    left: number,
    top: number,
    width: number,
}

export interface StarPosition {
    height: number,
    width: number,
    x: number,
    y: number,
}

type BoundsReader = () => StarBounds;

export const createStarPositionResolver = (
    readHeaderBounds: BoundsReader,
    readMenuBounds: BoundsReader,
) => (): StarPosition => {
    const headerBounds = readHeaderBounds();
    const menuBounds = readMenuBounds();

    return {
        height: headerBounds.height,
        width: headerBounds.width,
        x: headerBounds.left - menuBounds.left,
        y: headerBounds.top - menuBounds.top,
    };
};
