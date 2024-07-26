let TWA = window.Telegram.WebApp;


class Vibra {
    static notification(type) {
        if (!TWA) return;
        const types = ['error', 'success', 'warning'];
        if (!types.includes(type)) type = 'success';
        TWA.HapticFeedback.notificationOccurred(type);
    }

    static impact(style) {
        if (!TWA) return;
        const styles = ['light', 'medium', 'heavy', 'rigid', 'soft'];
        if (!styles.includes(style)) style = 'medium';
        TWA.HapticFeedback.impactOccurred(style);
    }

    static selection() { 
        if (!TWA) return;
        TWA.HapticFeedback.selectionChanged();
    }
}


export default Vibra;