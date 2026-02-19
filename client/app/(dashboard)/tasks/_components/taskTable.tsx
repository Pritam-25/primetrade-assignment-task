"use client";

import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import CreateTaskDialog from "@/components/web/create-task-dialog";
import { request } from "@/lib/fetcher";
import { API } from "@/lib/api";
import { toast } from "sonner";
import { Pencil, Search, Trash2 } from "lucide-react";

export type TaskStatus = "pending" | "completed";

export type Task = {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
};

type TaskTableProps = {
  tasks: Task[];
};

export default function TaskTable({ tasks }: TaskTableProps) {
  const [localTasks, setLocalTasks] = useState<Task[]>(() => tasks);

  useEffect(() => {
    setLocalTasks(tasks);
  }, [tasks]);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "all">("all");

  // debounce search
  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearchTerm(searchInput);
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchInput]);

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const filteredTasks = useMemo(() => {
    let data = [...localTasks];

    // search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      data = data.filter(
        (t) =>
          t.title.toLowerCase().includes(term) ||
          (t.description?.toLowerCase().includes(term) ?? false),
      );
    }

    // status filter
    if (statusFilter !== "all") {
      data = data.filter((t) => t.status === statusFilter);
    }

    return data;
  }, [localTasks, searchTerm, statusFilter]);

  // selection helpers
  const handleCheckboxChange = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSelectAll = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      const ids = filteredTasks.map((t) => t.id);
      const allSelected = ids.every((id) => next.has(id));
      if (allSelected) ids.forEach((id) => next.delete(id));
      else ids.forEach((id) => next.add(id));
      return next;
    });
  };

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteIds, setDeleteIds] = useState<string[]>([]);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  const openBulkDeleteDialog = () => {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;
    setDeleteIds(ids);
    setConfirmOpen(true);
  };

  const openSingleDeleteDialog = (id: string) => {
    setDeleteIds([id]);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteIds.length === 0) return;

    const doDelete = async () => {
      try {
        // call backend bulk delete endpoint (server supports single or multiple)
        const res = await request(API.deleteTasks, "DELETE", {
          data: { ids: deleteIds },
        });

        if (res.success) {
          toast.success(
            Array.isArray(deleteIds) && deleteIds.length > 1
              ? `Deleted ${deleteIds.length} tasks`
              : `Task deleted successfully`,
          );

          setLocalTasks((prev) =>
            prev.filter((t) => !deleteIds.includes(t.id)),
          );
          setSelectedIds((prev) => {
            const next = new Set(prev);
            deleteIds.forEach((id) => next.delete(id));
            return next;
          });
        } else {
          toast.error(res.errMsg || "Failed to delete task(s)");
        }
      } catch {
        toast.error("Failed to delete task(s)");
      } finally {
        setConfirmOpen(false);
      }
    };

    void doDelete();
  };

  return (
    <div className="space-y-4">
      {/* Search & Filter */}
      <div className="flex flex-row gap-4 items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-10"
            placeholder="Search tasks..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3">
          {selectedIds.size > 0 ? (
            <Button
              variant="destructive"
              size="sm"
              onClick={openBulkDeleteDialog}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete ({selectedIds.size})
            </Button>
          ) : (
            <Select
              value={statusFilter}
              onValueChange={(v) => setStatusFilter(v as TaskStatus | "all")}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      <CreateTaskDialog
        trigger={null}
        open={editOpen}
        onOpenChange={(open) => {
          setEditOpen(open);
          if (!open) setEditTask(null);
        }}
        initialValues={
          editTask
            ? {
                id: editTask.id,
                title: editTask.title,
                description: editTask.description ?? "",
                status:
                  editTask.status === "completed" ? "COMPLETED" : "PENDING",
              }
            : undefined
        }
        mode="edit"
      />

      <Dialog open={confirmOpen} onOpenChange={(open) => setConfirmOpen(open)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Delete task{deleteIds.length > 1 ? "s" : ""}?
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone and will permanently remove{" "}
              {deleteIds.length} task{deleteIds.length > 1 ? "s" : ""}.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setConfirmOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleConfirmDelete}>
                Delete{deleteIds.length > 1 ? ` ${deleteIds.length}` : ""}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Task Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-accent">
            <TableRow>
              <TableHead className="text-center w-[50px]">
                <Checkbox
                  checked={
                    filteredTasks.length > 0 &&
                    filteredTasks.every((t) => selectedIds.has(t.id))
                  }
                  onCheckedChange={() => handleSelectAll()}
                />
              </TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[80px] text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredTasks.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-24 text-center text-muted-foreground"
                >
                  No tasks found
                </TableCell>
              </TableRow>
            ) : (
              filteredTasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell className="text-center">
                    <Checkbox
                      className="h-4 w-4"
                      checked={selectedIds.has(task.id)}
                      onCheckedChange={() => handleCheckboxChange(task.id)}
                    />
                  </TableCell>
                  <TableCell>{task.title}</TableCell>
                  <TableCell>{task.description ?? "-"}</TableCell>
                  <TableCell>
                    <div
                      className={cn(
                        "inline-flex items-center justify-center rounded-full border-1 px-2 py-1 text-xs font-medium w-fit whitespace-nowrap shrink-0",
                        task.status === "completed"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/40  dark:text-green-400"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-400",
                      )}
                    >
                      {task.status.charAt(0).toUpperCase() +
                        task.status.slice(1)}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditTask(task);
                          setEditOpen(true);
                        }}
                        className="cursor-pointer"
                      >
                        <Pencil />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openSingleDeleteDialog(task.id)}
                        className="cursor-pointer"
                      >
                        <Trash2 className="text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
