import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  FileText,
  Printer,
  Loader2,
  Plus,
  Search,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Column<T> {
  key: keyof T;
  header: string;
  render?: (value: any, row: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onAdd?: () => void;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onView?: (item: T) => void;
  onEncaisse?: (item: T) => void;
  onPrint?: (item: T) => void;
  searchable?: boolean;
  pagination?: boolean;
  itemsPerPage?: number;
  loading?: boolean;
  error?: string | null;
  addButtonText?: string;
  showAddButton?: boolean;
  refreshData?: () => void;
}

export function DataTable<T extends { id: number | string }>({
  data,
  columns,
  onAdd,
  onEdit,
  onDelete,
  onView,
  onEncaisse,
  onPrint,
  searchable = true,
  pagination = true,
  itemsPerPage = 10,
  loading = false,
  error = null,
  addButtonText = "Ajouter",
  showAddButton = true,
  refreshData,
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Filtrage des données
  const filteredData = data.filter((item) =>
    columns.some((column) => {
      const value = item[column.key];
      return value?.toString().toLowerCase().includes(search.toLowerCase());
    }),
  );

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = pagination
    ? filteredData.slice(startIndex, startIndex + itemsPerPage)
    : filteredData;

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  if (loading && data.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          {searchable && (
            <div className="w-64">
              <Input placeholder="Rechercher..." disabled />
            </div>
          )}
          {showAddButton && onAdd && (
            <Button disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Chargement...
            </Button>
          )}
        </div>
        <div className="rounded-md border">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex-1 flex items-center gap-2">
          {searchable && (
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher..."
                value={search}
                onChange={handleSearch}
                className="pl-8"
              />
            </div>
          )}
          {refreshData && (
            <Button variant="outline" size="sm" onClick={refreshData}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          )}
        </div>
        {showAddButton && onAdd && (
          <Button onClick={onAdd} className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            {addButtonText}
          </Button>
        )}
      </div>

      {error && (
        <div className="bg-destructive/15 text-destructive rounded-lg p-4">
          <p className="text-sm">{error}</p>
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column, index) => (
                <TableHead key={index} className={column.className}>
                  {column.header}
                </TableHead>
              ))}
              {(onView || onEdit || onDelete || onEncaisse || onPrint) && (
                <TableHead className="text-right">Actions</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + 1}
                  className="h-24 text-center"
                >
                  {search
                    ? "Aucun résultat trouvé"
                    : "Aucune donnée disponible"}
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row) => (
                <TableRow key={row.id}>
                  {columns.map((column, colIndex) => (
                    <TableCell key={colIndex} className={column.className}>
                      {column.render
                        ? column.render(row[column.key], row)
                        : (row[column.key] as React.ReactNode)}
                    </TableCell>
                  ))}
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Ouvrir le menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {onView && (
                          <DropdownMenuItem onClick={() => onView(row)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Voir
                          </DropdownMenuItem>
                        )}
                        {onEdit && (
                          <DropdownMenuItem onClick={() => onEdit(row)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Modifier
                          </DropdownMenuItem>
                        )}
                        {onEncaisse && (
                          <DropdownMenuItem onClick={() => onEncaisse(row)}>
                            <FileText className="mr-2 h-4 w-4" />
                            Encaisser
                          </DropdownMenuItem>
                        )}
                        {onPrint && (
                          <DropdownMenuItem onClick={() => onPrint(row)}>
                            <Printer className="mr-2 h-4 w-4" />
                            Imprimer
                          </DropdownMenuItem>
                        )}
                        {onDelete && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => onDelete(row)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Supprimer
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {pagination && totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-muted-foreground">
            Affichage de {startIndex + 1} à{" "}
            {Math.min(startIndex + itemsPerPage, filteredData.length)} sur{" "}
            {filteredData.length} éléments
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm">
              Page {currentPage} sur {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
