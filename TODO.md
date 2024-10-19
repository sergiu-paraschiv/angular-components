[x] Decide project structure (application, library, combination of both?)
    - we will use separate library projects for each component and reference these in our main application for easy local development.
    - advantage is that we can later easily push each library separately to the package registry.

[-] Table components
    [x] Decide data model and flows
        - table column
            - name (string, displayed in header)
            - property (string, displayed in header, used for `sort.columnName`)
            - sortable (boolean, overriden by table level `sortable` attribute)
        - table
            - needs access to all column information, defined with `t-column` components and accessed with a @ContentChildren query; columns should be displayed in order of appearance of `t-column` components
            - needs the following state (wrapped in rxjs Observables so we can use ChangeDetectionStrategy.OnPush more easily???):
                - column definitions (same data as table column definition, but list of)
                - data (T[] | Observable<T[]>, automatically re-render if Observable)
                - sort:
                    - columnName (string)
                    - direction (Enum{Ascending, Descending})
                - pagination:
                    - currentPage (number >= 0)
                    - pageSize (null | number >= 0)
                - sortable (boolean, enable/disable sorting, all columns and individual columns, disabling for all columns should ignore settings from individual columns)
        - table header, receives column definitions from parent table
        - table row, receives data and column definitions from parent table
        - table cell, receives data and column definition from parent table row
    [-] Decide what services and components are neeed
        - `t-grid` and `t-column` public components
        - `t-grid-header`, `t-grid-row` internal components
        - `t-grid-page-size` and `t-grid-pagination` internal components
        - ?
    [-] Document list of tests
        - `t-grid` handles data passed in as `T[]`
        - `pagination: null` disables pagination controls
        - `t-grid` handles data passed in as `Observable<T[]>`
        - changing data (as `T[]`) passed to `t-grid` requires manual re-render
        - changing data (as `Observable<T[]>`) passed to `t-grid` re-renderes the table automatically
        - changing sorting triggers `sortChange` event
        - changing pagination triggers `onChange` event
        - ?
    [ ] Styling

[ ] Progress indicator components
    [ ] Decide data model
    [ ] Decide what services and components are neeed
    [ ] Document list of tests
    [ ] Styling
