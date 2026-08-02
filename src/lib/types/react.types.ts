export type Renderable<T> = React.ReactNode | ((props: T) => React.ReactNode)
