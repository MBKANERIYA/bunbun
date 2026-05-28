import React, { useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Accordion, Form, Offcanvas, Button } from "react-bootstrap";
import { BsFilterLeft, BsFillGrid3X3GapFill, BsFillGridFill, BsGrid1X2Fill } from 'react-icons/bs';

import ProductCard from "../Component/ProductCard";

const CollectionPage = () => {
    // Data states
    const [products, setProducts] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [colors, setColors] = useState([]);
    const [maxPrice, setMaxPrice] = useState(0);
    const [loading, setLoading] = useState(true);

    // Filter and UI states
    const [selectedSubcategories, setSelectedSubcategories] = useState([]);
    const [priceRange, setPriceRange] = useState(0);
    const [selectedColor, setSelectedColor] = useState("");
    const [sortBy, setSortBy] = useState("default");
    const [gridColumns, setGridColumns] = useState(3);
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const category = queryParams.get("category");

    // --- EFFECT 1: Fetch initial product data based on category ---
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const payload = category ? { category } : {};
                const { data } = await axios.post("http://localhost:4000/v1/product/filterProduct", payload);
                
                const productsData = data.filterProduct || [];
                setProducts(productsData);
                
                const uniqueSubs = [...new Set(productsData.map(p => p.subcategory))];
                setSubcategories(uniqueSubs);
                const uniqueColors = [...new Set(productsData.map(p => p.color))];
                setColors(uniqueColors);
                const maxPriceValue = Math.max(0, ...productsData.map(p => Number(p.selling_price)));
                setMaxPrice(maxPriceValue);
            } catch (err) {
                console.error("Error fetching products:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [category]); // Re-fetches only when the main category changes

    // --- EFFECT 2: Initialize filter states from URL params once data is loaded ---
    useEffect(() => {
        if (!loading) {
            const params = new URLSearchParams(location.search);
            setSelectedSubcategories(params.get('subcategory')?.split(',').filter(Boolean) || []);
            setSelectedColor(params.get('color') || "");
            setPriceRange(Number(params.get('price')) || maxPrice);
            setSortBy(params.get('sort') || 'default');
        }
    }, [loading, maxPrice, location.search]);

    // --- EFFECT 3: Update URL whenever a filter state changes ---
    useEffect(() => {
        if (loading) return; // Don't update URL while initial data is loading

        const params = new URLSearchParams();
        if (category) params.set('category', category); // Preserve base category

        if (selectedSubcategories.length) params.set('subcategory', selectedSubcategories.join(','));
        if (selectedColor) params.set('color', selectedColor);
        if (priceRange < maxPrice) params.set('price', priceRange);
        if (sortBy !== 'default') params.set('sort', sortBy);
        
        // Using replace to avoid polluting browser history with every filter change
        navigate({ search: params.toString() }, { replace: true });
        
    }, [selectedSubcategories, selectedColor, priceRange, sortBy, loading]);


    // Apply filters and sorting using useMemo for optimization
    const filteredAndSortedProducts = useMemo(() => {
        let tempProducts = [...products];
        // Filtering logic remains the same
        if (selectedSubcategories.length > 0) tempProducts = tempProducts.filter(p => selectedSubcategories.includes(p.subcategory));
        if (selectedColor) tempProducts = tempProducts.filter(p => p.color === selectedColor);
        tempProducts = tempProducts.filter(p => Number(p.selling_price) <= priceRange);

        // Sorting logic remains the same
        switch (sortBy) {
            case 'price-asc': tempProducts.sort((a, b) => Number(a.selling_price) - Number(b.selling_price)); break;
            case 'price-desc': tempProducts.sort((a, b) => Number(b.selling_price) - Number(a.selling_price)); break;
            case 'name-asc': tempProducts.sort((a, b) => a.name.localeCompare(b.name)); break;
            default: break;
        }
        return tempProducts;
    }, [products, selectedSubcategories, selectedColor, priceRange, sortBy]);
    
    // Simplified Handlers: just set the state, the useEffect will handle the rest
    const handleSubcategoryChange = (sub) => {
        setSelectedSubcategories(prev => 
            prev.includes(sub) ? prev.filter(s => s !== sub) : [...prev, sub]
        );
    };
    
    const handleColorChange = (color) => {
        setSelectedColor(prev => prev === color ? "" : color);
    };

    const handleResetFilters = () => {
        setSelectedSubcategories([]);
        setSelectedColor("");
        setPriceRange(maxPrice);
        setSortBy("default");
    };

    // JSX for sidebar content to avoid duplication
    const sidebarContent = (
        <FilterSidebar
            subcategories={subcategories}
            selectedSubcategories={selectedSubcategories}
            handleSubcategoryChange={handleSubcategoryChange}
            priceRange={priceRange}
            maxPrice={maxPrice}
            handlePriceChange={setPriceRange}
            colors={colors}
            selectedColor={selectedColor}
            handleColorChange={handleColorChange}
            handleResetFilters={handleResetFilters}
        />
    );

    return (
        <div className="container-fluid collection-page my-5">
            <Button
                variant="dark"
                className="d-lg-none w-100 mb-4 mobile-filter-btn"
                onClick={() => setShowMobileFilters(true)}
            >
                <BsFilterLeft /> Filters & Sort
            </Button>

            <div className="row">
                <div className="col-lg-3 d-none d-lg-block">{sidebarContent}</div>
                
                <Offcanvas show={showMobileFilters} onHide={() => setShowMobileFilters(false)} placement="start">
                    <Offcanvas.Header closeButton><Offcanvas.Title>Filters</Offcanvas.Title></Offcanvas.Header>
                    <Offcanvas.Body>{sidebarContent}</Offcanvas.Body>
                </Offcanvas>

                <div className="col-lg-9">
                    {/* The ProductGrid component from the previous step works here without changes */}
                    {/* But for completeness, its logic is integrated below */}
                    <div className="toolbar d-flex flex-wrap justify-content-between align-items-center mb-4">
                        <div className="product-count">{filteredAndSortedProducts.length} Products</div>
                        <div className="d-flex align-items-center gap-3">
                            <Form.Select className="sort-by-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                                <option value="default">Default Sorting</option>
                                <option value="price-asc">Price: Low to High</option>
                                <option value="price-desc">Price: High to Low</option>
                                <option value="name-asc">Name: A to Z</option>
                            </Form.Select>
                            <div className="layout-toggle d-none d-md-flex">
                                <BsFillGridFill className={gridColumns === 2 ? 'active' : ''} onClick={() => setGridColumns(2)} />
                                <BsFillGrid3X3GapFill className={gridColumns === 3 ? 'active' : ''} onClick={() => setGridColumns(3)} />
                                <BsGrid1X2Fill className={gridColumns === 4 ? 'active' : ''} onClick={() => setGridColumns(4)} />
                            </div>
                        </div>
                    </div>
                    {filteredAndSortedProducts.length > 0 ? (
                        <div className="row">
                            {filteredAndSortedProducts.map((product) => (
                                <div key={product._id} className={`mb-4 col-6 col-md-6 col-lg-${12 / gridColumns}`}>
                                    <ProductCard product={product} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center p-5">
                            <h4>No products found</h4>
                            <p className="text-muted">Try adjusting your filters to find what you're looking for.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// You can keep the FilterSidebar as a separate component or integrate its JSX here too.
// For simplicity, this example assumes you have it defined as in the previous step.
const FilterSidebar = ({ subcategories, selectedSubcategories, handleSubcategoryChange, priceRange, maxPrice, handlePriceChange, colors, selectedColor, handleColorChange, handleResetFilters }) => (
    <div className="filter-sidebar">
        <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="filter-title">Filters</h4>
            <button className="btn-clear-all" onClick={handleResetFilters}>Clear All</button>
        </div>
        <Accordion defaultActiveKey={['0', '1']} alwaysOpen>
            <Accordion.Item eventKey="0">
                <Accordion.Header>Category</Accordion.Header>
                <Accordion.Body>
                    {subcategories.map((sub, index) => (
                        <Form.Check key={index} type="checkbox" id={`sub-${index}`} className="custom-checkbox" label={sub} checked={selectedSubcategories.includes(sub)} onChange={() => handleSubcategoryChange(sub)} />
                    ))}
                </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
                <Accordion.Header>Price</Accordion.Header>
                <Accordion.Body>
                    <Form.Range min={0} max={maxPrice} value={priceRange} onChange={(e) => handlePriceChange(Number(e.target.value))} />
                    <div className="d-flex justify-content-between text-muted small mt-2">
                        <span>₹0</span>
                        <span>₹{priceRange.toLocaleString()}</span>
                    </div>
                </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="2">
                <Accordion.Header>Color</Accordion.Header>
                <Accordion.Body className="color-filter-body">
                    {colors.map((color, index) => (
                        <div key={index} className="color-option" onClick={() => handleColorChange(color)}>
                            <span className={`color-swatch ${selectedColor === color ? 'selected' : ''}`} style={{ backgroundColor: color }} />
                            <span className="color-name">{color}</span>
                        </div>
                    ))}
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    </div>
);


export default CollectionPage;