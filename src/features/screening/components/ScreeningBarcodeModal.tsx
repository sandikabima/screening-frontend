import React, { useState } from "react";
import { Download, Printer, X, Loader2 } from "lucide-react";
import { Button } from "@/shared/components/ui/Button";
import { ScreeningSchedule } from "../types/screeningSchedule.types";
import { formatDate } from "@/shared/utils/formatDate";

interface ScreeningBarcodeModalProps {
  schedule: ScreeningSchedule | null;
  onClose: () => void;
}

export const ScreeningBarcodeModal: React.FC<ScreeningBarcodeModalProps> = ({
  schedule,
  onClose,
}) => {
  const [downloading, setDownloading] = useState(false);

  if (!schedule) return null;

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
    schedule.barcodeValue,
  )}`;

  const handleDownloadBarcode = async () => {
    try {
      setDownloading(true);
      const response = await fetch(qrImageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `QR-${schedule.barcodeValue}.png`;
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Gagal mengunduh QR Code:", error);
    } finally {
      setDownloading(false);
    }
  };

  // Fungsi Cetak via Hidden Iframe (Solusi Gambar & Layout Bersih)
  const handlePrintBarcode = () => {
    const printWindow = window.open("", "_blank", "width=600,height=600");
    if (!printWindow) return;

    const formattedDate = formatDate(schedule.tanggal, {
      variant: "MEDIUM_DATE",
    });

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Cetak QR - ${schedule.barcodeValue}</title>
          <style>
            @page {
              size: auto;
              margin: 0;
            }
            body {
              font-family: monospace;
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              margin: 0;
              background-color: #ffffff;
            }
            .ticket {
              border: 2px solid #000;
              padding: 24px;
              border-radius: 12px;
              text-align: center;
              width: 280px;
            }
            .badge {
              font-size: 10px;
              font-weight: bold;
              border: 1px solid #000;
              padding: 2px 8px;
              border-radius: 4px;
              text-transform: uppercase;
            }
            .title {
              font-size: 14px;
              font-weight: bold;
              margin-top: 12px;
              margin-bottom: 4px;
              text-transform: uppercase;
            }
            .subtitle {
              font-size: 10px;
              color: #555;
              margin-bottom: 16px;
            }
            .qr-box {
              border: 1px solid #ddd;
              padding: 12px;
              border-radius: 8px;
              display: inline-block;
            }
            .qr-box img {
              width: 180px;
              height: 180px;
              display: block;
              margin: 0 auto;
            }
            .code {
              font-size: 14px;
              font-weight: font-black;
              letter-spacing: 2px;
              margin-top: 8px;
              text-transform: uppercase;
            }
          </style>
        </head>
        <body>
          <div class="ticket">
            <span class="badge">OTORITAS SESI SCREENING</span>
            <div class="title">${schedule.name}</div>
            <div class="subtitle">${formattedDate} • ${schedule.jamMulai} - ${schedule.jamSelesai}</div>
            <div class="qr-box">
              <img src="${qrImageUrl}" alt="QR Code" onload="window.print(); window.close();" />
              <div class="code">${schedule.barcodeValue}</div>
            </div>
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm font-mono select-none">
      <div className="w-full max-w-sm bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-6 text-center relative animate-in fade-in zoom-in-95 duration-150">
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 text-zinc-500 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        {/* HEADER */}
        <div>
          <span className="text-[10px] font-bold text-amber-500 tracking-widest uppercase bg-amber-950/60 px-2.5 py-1 rounded border border-amber-800/80">
            OTORITAS SESI BARCODE
          </span>
          <h3 className="text-base font-black text-white mt-3 uppercase tracking-wide line-clamp-1">
            {schedule.name}
          </h3>
          <p className="text-[11px] text-zinc-500 mt-1">
            {formatDate(schedule.tanggal, { variant: "MEDIUM_DATE" })} •{" "}
            {schedule.jamMulai} - {schedule.jamSelesai}
          </p>
        </div>

        {/* BARCODE & QR CODE VISUALIZER */}
        <div className="bg-white p-6 rounded-xl flex flex-col items-center justify-center space-y-3 shadow-inner">
          <img
            src={qrImageUrl}
            alt={`QR Code ${schedule.barcodeValue}`}
            className="w-44 h-44 object-contain"
          />
          <div className="w-full pt-2 border-t border-zinc-200">
            <p className="font-mono text-base font-black tracking-widest text-black uppercase">
              {schedule.barcodeValue}
            </p>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          <Button
            variant="success"
            size="md"
            onClick={handleDownloadBarcode}
            disabled={downloading}
            className="w-full text-xs font-bold"
          >
            {downloading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />
                DOWNLOADING...
              </>
            ) : (
              <>
                <Download className="h-3.5 w-3.5 mr-1" />
                DOWNLOAD QR
              </>
            )}
          </Button>

          <Button
            variant="primary"
            size="md"
            onClick={handlePrintBarcode}
            className="w-full text-xs font-bold"
          >
            <Printer className="h-3.5 w-3.5 mr-1" />
            CETAK QR
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ScreeningBarcodeModal;
