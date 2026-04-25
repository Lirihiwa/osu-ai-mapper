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
import {LoadingOutlined} from "@ant-design/icons";
import {useSettingsStore} from "./store/useSettingsStore.ts";
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts.ts'

function App() {
    const isAppBusy = useSettingsStore(s => s.isAppBusy);
    useKeyboardShortcuts();


    return (
        <>
            {isAppBusy && (
                <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center cursor-wait">
                    <div className="flex flex-col items-center gap-4">
                        <LoadingOutlined className="text-accent text-4xl animate-spin" />
                        <span className="text-accent font-bold uppercase tracking-widest animate-pulse">
                       Processing...
                   </span>
                    </div>
                </div>
            )}
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