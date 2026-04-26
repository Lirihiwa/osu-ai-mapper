import "flag-icons/css/flag-icons.min.css";
import { StudioLayout } from './components/layout/StudioLayout';
import {Header} from "./components/header/Header.tsx";
import {Toolbar} from "./components/toolbar/Toolbar.tsx";
import {PreviewCanvas} from "./components/preview/PreviewCanvas.tsx";
import {SettingsPanel} from "./components/settings/SettingsPanel.tsx";
import {Timeline} from "./components/timeline/Timeline.tsx";
import {AudioEngine} from "./components/AudioEngine.tsx";
import {HitSoundEngine} from "./components/HitSoundEngine.tsx";
import {Toaster} from "sonner";
import {useSettingsStore} from "./store/useSettingsStore.ts";
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts.ts'
import Loading from "./components/ui/Loading.tsx";

function App() {
    const isAppBusy = useSettingsStore(s => s.isAppBusy);
    useKeyboardShortcuts();

    return (
        <>
            {isAppBusy && <Loading />}
            <Toaster theme="dark" position="bottom-right" />
            <AudioEngine />
            <HitSoundEngine />
            <StudioLayout
                header={<Header />}
                toolbar={<Toolbar />}
                preview={<PreviewCanvas />}
                settings={<SettingsPanel />}
                timeline={<Timeline />}
            />
        </>
    );
}

export default App;