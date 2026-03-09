import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Plus, ChevronDown, List } from "lucide-react";
import { AddItemDialog } from "@/components/AddItemDialog";
import { BulkAddDialog } from "@/components/BulkAddDialog";

interface AddItemDropdownProps {
  bagId: string;
}

export function AddItemDropdown({ bagId }: AddItemDropdownProps) {
  const [singleOpen, setSingleOpen] = useState(false);
  const [bulkOpen, setBulkOpen] = useState(false);

  return (
    <>
      <div className="flex">
        <Button variant="outline" size="sm" className="gap-2 rounded-r-none" onClick={() => setSingleOpen(true)}>
          <Plus className="h-4 w-4" /> Aggiungi
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="px-2 rounded-l-none border-l-0">
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setSingleOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Aggiungi Oggetto
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setBulkOpen(true)}>
              <List className="mr-2 h-4 w-4" /> Importa Lista
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <AddItemDialog bagId={bagId} open={singleOpen} onOpenChange={setSingleOpen} />
      <BulkAddDialog bagId={bagId} open={bulkOpen} onOpenChange={setBulkOpen} />
    </>
  );
}
