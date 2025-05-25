// utils/snackbar.ts
export const message = (msg: string, color: string = 'info', timeout = 3000, position = 'top') => {
    window.$showSnackbar?.(msg, color, timeout, position)
}