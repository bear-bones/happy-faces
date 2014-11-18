# Happy Faces Reporting Software

This project contains two separate applications, `Meals Reports` and
`Title XX`, which share many common components.  They are required to
be separate, though, because users of certain PCs only have access to
one or the other.


## Similarities
Both applications use the node modules
[`mssql`](https://github.com/patriksimek/node-mssql) and
[`tedious`](https://github.com/pekim/tedious) to read from the
ChildCare Manager MSSQL database.  Both use a WebSQL database to save
the subset of CCM data that they need, their configuration, and any
updates to the data.  Both use
[`node-webkit`](https://github.com/rogerwang/node-webkit),
[`polymer`](http://www.polymer-project.org/), and
[`sortable-table`](https://github.com/stevenrskelton/sortable-table)
for the user interface.  Both use
[`js-xlsx`](https://github.com/SheetJS/js-xlsx) to generate Excel
reports.


## Meals Reports

TODO


## Title XX

This report pulls demographic and attendance information about
children and runs calculations on it to determine (a) the child's
remaining hours/days of Title-XX-covered care and (b) the Title XX
reimbursement owed to Happy Faces for the child.  The generated Excel
report shows attendance by day (sheets 1 and 2), attendance detail
(sheet 3), and attendance and reimbursement summary information (sheet
4).
