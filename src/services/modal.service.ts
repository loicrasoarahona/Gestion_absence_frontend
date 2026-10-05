type ModalInstance = {
  open: () => void;
  close: () => void;
  isOpen: () => boolean;
  _setOpen: (state: boolean) => void;
};

export class ModalService {
  private instances = new Map<string, ModalInstance>();

  getOrCreateInstance(id: string): ModalInstance {
    if (this.instances.has(id)) {
      return this.instances.get(id)!;
    }

    const newInstance: ModalInstance = {
      open: () => this.instances.get(id)?._setOpen(true),
      close: () => this.instances.get(id)?._setOpen(false),
      isOpen: () => false,
      _setOpen: () => {},
    };

    this.instances.set(id, newInstance);
    return newInstance;
  }

  register(
    id: string,
    setOpen: (open: boolean) => void,
    getOpen: () => boolean,
  ) {
    const instance = this.getOrCreateInstance(id);
    instance._setOpen = setOpen;
    instance.isOpen = getOpen;
  }

  unregister(id: string) {
    this.instances.delete(id);
  }
}
