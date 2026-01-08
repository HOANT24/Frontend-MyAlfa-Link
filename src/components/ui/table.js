import * as React from "react";

/* =======================
   TABLE ROOT
======================= */
export function Table({ className = "", children, ...props }) {
  return (
    <div className="w-full overflow-x-auto">
      <table
        className={`w-full border border-gray-300 border-collapse text-sm ${className}`}
        {...props}
      >
        {children}
      </table>
    </div>
  );
}

/* =======================
   TABLE HEAD
======================= */
export function TableHead({ className = "", children }) {
  return <thead className={`bg-gray-100 ${className}`}>{children}</thead>;
}

/* =======================
   TABLE BODY
======================= */
export function TableBody({ className = "", children }) {
  return <tbody className={className}>{children}</tbody>;
}

/* =======================
   TABLE FOOTER
======================= */
export function TableFooter({ className = "", children }) {
  return <tfoot className={`bg-gray-50 ${className}`}>{children}</tfoot>;
}

/* =======================
   TABLE ROW
======================= */
export function TableRow({ className = "", children, ...props }) {
  return (
    <tr
      className={`hover:bg-gray-50 transition-colors ${className}`}
      {...props}
    >
      {children}
    </tr>
  );
}

/* =======================
   TABLE HEADER CELL (th)
======================= */
export function TableHeaderCell({ className = "", children, ...props }) {
  return (
    <th
      className={`border border-gray-300 px-3 py-2 text-center font-semibold ${className}`}
      {...props}
    >
      {children}
    </th>
  );
}

/* =======================
   TABLE CELL (td)
======================= */
export function TableCell({ className = "", children, ...props }) {
  return (
    <td
      className={`border border-gray-300 px-2 py-1 text-center align-middle ${className}`}
      {...props}
    >
      {children}
    </td>
  );
}
